import { NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';

// タイムアウト付きのプロミスを返すヘルパー関数
const withTimeout = (promise: Promise<any>, ms: number) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request Timeout')), ms)
    )
  ]);
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, category, condition, details, tone } = body;

    let ai;
    try {
      ai = getGeminiClient();
    } catch (e: any) {
      return NextResponse.json(
        { error: 'Gemini APIキーが設定されていません。.env.local ファイルを確認してください。' },
        { status: 500 }
      );
    }

    const prompt = `
あなたはフリマアプリ（メルカリ、ラクマ、ヤフオク等）のプロの出品者であり、魅力的な商品説明文を作成するエキスパートです。
以下の商品情報をもとに、売れる出品テキストを生成してください。

【商品情報】
・商品名・型番・ブランド名：${title}
・カテゴリ：${category}
・商品の状態：${condition}
・補足情報：${details || '特になし'}
・文章のトーン：${tone}

【出力要件】
以下の構造を持つJSON形式で出力してください。Markdownのコードブロックは含めず純粋なJSONオブジェクトのみを出力してください。
1. titles: タイトル案（30〜40字以内）を文字列の配列で3パターン生成（検索キーワード、ブランド名、型番、状態を前方に配置）
2. body: 出品本文。以下のセクションを見出しとして含め、整然と配置すること。
   - 【おすすめポイント】
   - 【商品詳細・スペック】
   - 【状態・留意事項】
   - 【発送・梱包について】
   ※トーンに合わせて文末表現やアピール度合いを調整。NGワード（ノークレーム・ノーリターン等）は出力禁止。
3. tags: ハッシュタグを文字列の配列で8〜12個生成。

【出力JSONフォーマット】
{
  "titles": ["タイトル案1", "タイトル案2", "タイトル案3"],
  "body": "生成された出品本文...",
  "tags": ["#タグ1", "#タグ2"]
}
`;

    // 試行するモデルの順番
    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.5-flash'];
    const maxRetriesPerModel = 2;
    const timeoutMs = 15000; // 15秒でタイムアウト

    let lastError = null;

    for (const model of modelsToTry) {
      for (let attempt = 1; attempt <= maxRetriesPerModel; attempt++) {
        try {
          console.log(`[Attempt ${attempt}/${maxRetriesPerModel}] Try model: ${model}`);
          
          const response: any = await withTimeout(
            ai.models.generateContent({
              model: model,
              contents: prompt,
              config: {
                responseMimeType: "application/json",
              }
            }),
            timeoutMs
          );

          const text = response.text;
          if (!text) {
            throw new Error("No text generated");
          }

          const parsed = JSON.parse(text);
          return NextResponse.json(parsed);

        } catch (error: any) {
          console.warn(`[Error] model ${model} (attempt ${attempt}): ${error.message}`);
          lastError = error;
          // すぐに再試行せず1秒待機
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }

    console.error("All retries failed. Last error:", lastError);
    return NextResponse.json(
      { error: "サーバーが大変混雑しているか、タイムアウトが発生しました。時間をおいて再度お試しください。" },
      { status: 503 }
    );

  } catch (error: any) {
    console.error("Generate API Error:", error);
    return NextResponse.json(
      { error: "説明文の生成中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
