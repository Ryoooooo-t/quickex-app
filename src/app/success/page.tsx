"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // 決済が成功したとみなし、PROユーザーステータスを付与
    localStorage.setItem('is_pro_user', 'true');
    
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm w-full animate-in zoom-in duration-300">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">決済完了！</h1>
        <p className="text-slate-600 mb-6 text-sm">
          PROプランの機能が解放されました。<br/>制限なしで生成をお楽しみいただけます。
        </p>
        <p className="text-xs text-slate-400">3秒後にトップページへ戻ります...</p>
        <div className="mt-6 w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}
