"use client";
import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ResultPreviewProps {
  result: any;
  isLoading: boolean;
}

export default function ResultPreview({ result, isLoading }: ResultPreviewProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setProgress(0);
      // 約5秒で90%まで進むシミュレーション
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + Math.floor(Math.random() * 10) + 5;
        });
      }, 500);
    } else {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 500); // 完了後にリセット
      return () => clearTimeout(timer);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col items-center justify-center text-slate-700 min-h-[400px]">
        <div className="relative w-16 h-16 mb-6">
          <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-blue-700">
            {progress}%
          </div>
        </div>
        <p className="font-medium mb-2 text-lg">AIが最適な出品文を生成しています...</p>
        <p className="text-sm text-slate-500 mb-6">商品情報から魅力を最大限に引き出しています。数秒お待ちください。</p>
        
        {/* プログレスバー */}
        <div className="w-full max-w-xs bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col items-center justify-center text-slate-400 min-h-[400px]">
        <p>左側のフォームに入力して「生成する」ボタンを押すと、<br/>ここに結果が表示されます。</p>
      </div>
    );
  }

  // クリップボードコピー処理（HTTP環境のスマホ対応版）
  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // スマホでの実機テスト等、HTTP（非セキュア）環境用のフォールバック
        const textArea = document.createElement("textarea");
        textArea.value = text;
        // 画面外に配置してフォーカスを当てないようにする
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Fallback copy failed', err);
          throw new Error('Copy command failed');
        } finally {
          textArea.remove();
        }
      }
      toast.success('コピーしました！', {
        duration: 2000,
        icon: '✨',
      });
    } catch (err) {
      toast.error('コピーに失敗しました。');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
      <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">生成結果プレビュー</h2>
      
      <div className="space-y-6 flex-1 overflow-y-auto pr-2">
        
        {/* タイトル案 */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-md inline-block">タイトル案（タップでコピー）</h3>
          </div>
          <div className="space-y-2">
            {result.titles.map((title: string, i: number) => (
              <button 
                key={i} 
                onClick={() => copyToClipboard(title)}
                className="w-full text-left p-3 text-sm bg-slate-50 border border-slate-200 rounded-md hover:bg-blue-50 hover:border-blue-200 transition-colors flex justify-between items-center group"
              >
                <span className="font-medium text-slate-800">{title}</span>
                <Copy className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
              </button>
            ))}
          </div>
        </section>

        {/* 出品本文 */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-md inline-block">出品本文</h3>
            <button 
              onClick={() => copyToClipboard(result.body)}
              className="flex items-center gap-1.5 text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md font-semibold hover:bg-blue-200 transition-colors"
            >
              <Copy className="w-4 h-4" />
              本文をコピー
            </button>
          </div>
          <div className="bg-slate-50 p-4 border border-slate-200 rounded-md text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
            {result.body}
          </div>
        </section>

        {/* ハッシュタグ */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-md inline-block">ハッシュタグ</h3>
            <button 
              onClick={() => copyToClipboard(result.tags.join(' '))}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors"
            >
              <Copy className="w-4 h-4" />
              一括コピー
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.tags.map((tag: string) => (
              <button 
                key={tag} 
                onClick={() => copyToClipboard(tag)}
                className="text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded border border-blue-100 transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
