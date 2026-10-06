"use client";
import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface GeneratorFormProps {
  onSubmit: (formData: any) => void;
  isLoading: boolean;
  remaining: number | string;
}

export default function GeneratorForm({ onSubmit, isLoading, remaining }: GeneratorFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    condition: '',
    details: '',
    tone: '丁寧・安心型'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.condition) {
      alert("必須項目を入力してください。");
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-2">商品情報を入力</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 商品名 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            商品名・型番・ブランド名 <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="例: Apple AirPods Pro 第2世代 MQD83J/A"
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            disabled={isLoading}
          />
        </div>

        {/* カテゴリ */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            カテゴリ <span className="text-red-500">*</span>
          </label>
          <select 
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            disabled={isLoading}
          >
            <option value="">選択してください</option>
            <option value="レディース">レディース</option>
            <option value="メンズ">メンズ</option>
            <option value="家電・スマホ">家電・スマホ・カメラ</option>
            <option value="ホビー・おもちゃ">おもちゃ・ホビー・グッズ</option>
            <option value="本・音楽・ゲーム">本・音楽・ゲーム</option>
            <option value="コスメ・美容">コスメ・香水・美容</option>
            <option value="その他">その他</option>
          </select>
        </div>

        {/* 商品の状態 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            商品の状態 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {["新品・未使用", "未使用に近い", "目立った傷や汚れなし", "やや傷や汚れあり", "全体的に状態が悪い"].map((condition) => (
              <label key={condition} className={`flex items-center gap-2 p-2 border rounded-md cursor-pointer transition-colors ${formData.condition === condition ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input 
                  type="radio" 
                  name="condition" 
                  value={condition} 
                  onChange={handleChange}
                  checked={formData.condition === condition}
                  className="sr-only" 
                  disabled={isLoading}
                />
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.condition === condition ? 'border-blue-600' : 'border-slate-300'}`}>
                  {formData.condition === condition && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>
                <span className="text-slate-700">{condition}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 補足情報 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            補足情報・アピール点 <span className="text-slate-400 text-xs font-normal">（任意）</span>
          </label>
          <textarea 
            name="details"
            value={formData.details}
            onChange={handleChange}
            rows={3}
            placeholder="例: 半年前に購入、週1回使用。箱・説明書あり。即購入OKです！"
            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-y"
            disabled={isLoading}
          ></textarea>
        </div>

        {/* 文章のトーン */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            文章のトーン <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row bg-slate-100 p-1 rounded-lg gap-1">
            {["丁寧・安心型", "スピード即売型", "シンプル要点型"].map((tone) => (
              <label key={tone} className={`flex-1 text-center py-2 text-sm cursor-pointer rounded-md transition-colors ${formData.tone === tone ? 'bg-white shadow-sm font-medium text-blue-600' : 'text-slate-600 hover:bg-slate-200'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input 
                  type="radio" 
                  name="tone" 
                  value={tone} 
                  onChange={handleChange}
                  checked={formData.tone === tone}
                  className="sr-only" 
                  disabled={isLoading}
                />
                {tone}
              </label>
            ))}
          </div>
        </div>

        {/* 実行ボタン */}
        <div className="pt-4">
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>生成中...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>売れる説明文を生成する（{remaining === '∞' ? '無制限' : `無料枠を1回消費`}）</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
