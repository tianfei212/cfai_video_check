
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuditLoading: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const { targetId, baseId } = location.state || {};

  useEffect(() => {
    // 3秒进度模拟
    const startTime = Date.now();
    const duration = 3000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const nextProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(nextProgress);

      if (nextProgress >= 100) {
        clearInterval(interval);
        // 跳转到 AuditDetail，并保留对比 ID 信息
        navigate(`/audit/${targetId}`, { state: { baseId, targetId }, replace: true });
      }
    }, 16);

    return () => clearInterval(interval);
  }, [navigate, targetId, baseId]);

  return (
    <div className="fixed inset-0 bg-[#0A0A0B] flex flex-col items-center justify-center text-white z-[200] overflow-hidden">
      {/* 背景环境光 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center px-10">
        {/* 核心扫描动画组件 */}
        <div className="relative w-32 h-32 mb-12">
           <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full"></div>
           <div className="absolute inset-0 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
           <div className="absolute inset-4 border border-indigo-500/30 rounded-full animate-ping"></div>
           <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
           </div>
        </div>

        <div className="text-center mb-10 space-y-2">
           <h2 className="text-2xl font-bold tracking-tight text-white/90">正在初始化像素级差异对比</h2>
           <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.3em] italic animate-pulse">
             CAF-Diff 深度学习引擎正在提取特征向量...
           </p>
        </div>

        {/* 进度条系统 */}
        <div className="w-full space-y-4">
           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all duration-75"
                style={{ width: `${progress}%` }}
              ></div>
           </div>
           <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-mono text-gray-600 uppercase tracking-tighter">Analyzing frames</span>
              <span className="text-[10px] font-mono text-blue-400 font-bold">{Math.round(progress)}%</span>
           </div>
        </div>

        {/* 底部装饰流 */}
        <div className="mt-20 grid grid-cols-2 gap-x-12 gap-y-4 w-full border-t border-white/5 pt-10">
           <div className="flex flex-col gap-1">
              <span className="text-[8px] text-gray-600 font-bold uppercase">Base Version</span>
              <span className="text-xs font-mono font-bold text-gray-400">V1.0_ORIGINAL</span>
           </div>
           <div className="flex flex-col gap-1 text-right">
              <span className="text-[8px] text-gray-600 font-bold uppercase">Target Version</span>
              <span className="text-xs font-mono font-bold text-blue-400">V1.2_REVISED</span>
           </div>
        </div>
      </div>

      {/* 扫描线效果 */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-0 left-0 right-0 h-px bg-blue-500/50 animate-[scan_4s_linear_infinite]"></div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}} />
    </div>
  );
};

export default AuditLoading;
