import { useState, useEffect } from 'react';

const MAX_FREE_USAGE = 3;

export function useUsageLimit() {
  const [usageCount, setUsageCount] = useState<number>(0);
  const [isProUser, setIsProUser] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // クライアントサイドでのみ実行
    const storedIsPro = localStorage.getItem('is_pro_user') === 'true';
    setIsProUser(storedIsPro);

    if (!storedIsPro) {
      const resetDate = localStorage.getItem('quickex_reset_date');
      const storedCount = localStorage.getItem('quickex_usage_count');
      
      // 日本時間（JST）ベースでの日付取得を想定（簡易的にローカルタイムゾーン）
      const today = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');

      if (resetDate !== today) {
        // 日付が変わっていればリセット
        localStorage.setItem('quickex_reset_date', today);
        localStorage.setItem('quickex_usage_count', '0');
        setUsageCount(0);
      } else {
        setUsageCount(storedCount ? parseInt(storedCount, 10) : 0);
      }
    }
    setIsLoaded(true);
  }, []);

  const incrementUsage = () => {
    if (isProUser) return true; // PROユーザーは無制限
    
    if (usageCount >= MAX_FREE_USAGE) {
      return false; // 上限到達
    }
    
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem('quickex_usage_count', newCount.toString());
    return true;
  };

  const decrementUsage = () => {
    if (isProUser) return;
    if (usageCount > 0) {
      const newCount = usageCount - 1;
      setUsageCount(newCount);
      localStorage.setItem('quickex_usage_count', newCount.toString());
    }
  };

  const remaining = isProUser ? '∞' : Math.max(0, MAX_FREE_USAGE - usageCount);

  return { 
    usageCount, 
    remaining, 
    isProUser, 
    incrementUsage,
    decrementUsage,
    isLoaded, 
    MAX_FREE_USAGE 
  };
}
