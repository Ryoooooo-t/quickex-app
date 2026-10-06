"use client";
import React, { useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProModal({ isOpen, onClose }: ProModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async (plan: 'lifetime' | 'monthly') => {
    setLoadingPlan(plan);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'エラーが発生しました');
      if (data.url) window.location.href = data.url; // Stripe Checkoutへリダイレクト
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <div className="relative bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-white text-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
            PROプランへアップグレード
          </h2>
          <p className="text-white/90 text-sm">無料枠を使い切りました。PROプランで無制限に生成しましょう！</p>
        </div>

        <div className="p-6">
          <ul className="space-y-3 mb-8">
            {["生成回数が無制限に", "より高度なAIモデルの使用", "優先サポート", "広告の非表示"].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-700">
                <div className="bg-amber-100 p-1 rounded-full text-amber-600">
                  <Check className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            <button 
              onClick={() => handleCheckout('lifetime')}
              disabled={loadingPlan !== null}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md disabled:bg-slate-400"
            >
              {loadingPlan === 'lifetime' ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              買い切りプラン（980円）で購入
            </button>
            <button 
              onClick={() => handleCheckout('monthly')}
              disabled={loadingPlan !== null}
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {loadingPlan === 'monthly' ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              月額プラン（500円/月）で登録
            </button>
          </div>
          
          <p className="text-center text-xs text-slate-400 mt-4">
            Stripeを使用した安全な決済です
          </p>
        </div>
      </div>
    </div>
  );
}
