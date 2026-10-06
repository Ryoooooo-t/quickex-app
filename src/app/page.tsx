"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import GeneratorForm from "@/components/GeneratorForm";
import ResultPreview from "@/components/ResultPreview";
import ProModal from "@/components/ProModal";
import { useUsageLimit } from "@/lib/useUsageLimit";

export default function Home() {
  const { remaining, isProUser, incrementUsage, decrementUsage, isLoaded, MAX_FREE_USAGE } = useUsageLimit();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async (formData: any) => {
    // 1. 回数制限のチェックと消費
    const canGenerate = incrementUsage();
    if (!canGenerate) {
      setIsModalOpen(true);
      return;
    }

    // 2. ローディング状態ON
    setIsLoading(true);

    // 3. APIリクエスト
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'APIリクエストに失敗しました');
      }

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
      // エラー時は利用回数を戻す
      decrementUsage();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <Header 
        remaining={remaining} 
        maxFree={MAX_FREE_USAGE} 
        isPro={isProUser}
        isLoaded={isLoaded}
        onOpenPro={() => setIsModalOpen(true)}
      />
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 左側：入力フォーム */}
          <div className="lg:col-span-5">
            <GeneratorForm 
              onSubmit={handleGenerate} 
              isLoading={isLoading} 
              remaining={remaining}
            />
          </div>
          
          {/* 右側：プレビュー */}
          <div className="lg:col-span-7 h-full">
            <ResultPreview 
              result={result} 
              isLoading={isLoading} 
            />
          </div>
          
        </div>
      </main>

      <ProModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
