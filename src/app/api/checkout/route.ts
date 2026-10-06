import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();
    const isMonthly = plan === 'monthly';

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe APIキーが設定されていません。.env.local を確認してください。' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia' as any,
    });

    // リクエスト元（スマホなどのIPアドレス）のURLを動的に取得
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      managed_payments: { enabled: false },
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: isMonthly ? 'QuickEx PRO (月額サブスクリプション)' : 'QuickEx PRO (買い切り)',
            },
            unit_amount: isMonthly ? 500 : 980,
            ...(isMonthly && { recurring: { interval: 'month' } }),
          },
          quantity: 1,
        },
      ],
      mode: isMonthly ? 'subscription' : 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: '決済セッションの作成に失敗しました。' }, { status: 500 });
  }
}
