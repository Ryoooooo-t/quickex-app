import React from 'react';
import { Sparkles, Crown } from 'lucide-react';

interface HeaderProps {
  remaining: number | string;
  maxFree: number;
  isPro: boolean;
  onOpenPro: () => void;
  isLoaded: boolean;
}

export default function Header({ remaining, maxFree, isPro, onOpenPro, isLoaded }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-600">
          <Sparkles className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight">QuickEx</h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {!isPro && (
            <div className="text-xs sm:text-sm font-medium text-slate-600 bg-slate-100 px-2 sm:px-3 py-1.5 rounded-full whitespace-nowrap">
              <span className="hidden sm:inline">本日残り: </span>
              {isLoaded ? <span className="text-blue-600 font-bold">{remaining}/{maxFree}</span> : <span className="text-slate-400">...</span>}
              <span className="sm:hidden">回</span>
              <span className="hidden sm:inline"> 回</span>
            </div>
          )}
          
          {isPro ? (
            <div className="flex items-center gap-1 bg-gradient-to-r from-slate-800 to-slate-900 text-amber-400 px-2 sm:px-4 py-1.5 sm:py-2 rounded-md font-bold text-xs sm:text-sm shadow-sm whitespace-nowrap">
              <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>PRO</span>
            </div>
          ) : (
            <button 
              onClick={onOpenPro}
              className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-md font-semibold text-xs sm:text-sm hover:from-amber-500 hover:to-amber-600 transition-colors shadow-sm whitespace-nowrap"
            >
              <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>PRO解放</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
