
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

interface ShotBlock {
  id: string;
  start: number;
  width: number;
  color: string;
  type: string;
}

interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface BaseProblem {
  id: string;
  timecode: string;
  type: string;
  description: string;
  frames: string;
  progress: number;
  box?: BoundingBox; 
}

const BASE_SHOTS: ShotBlock[] = [
  { id: 'b1', start: 0, width: 15, color: 'bg-green-500/40', type: '正常' },
  { id: 'b2', start: 15, width: 20, color: 'bg-orange-500/40', type: '变动' },
  { id: 'b3', start: 35, width: 10, color: 'bg-red-500/40', type: '敏感' },
  { id: 'b4', start: 45, width: 55, color: 'bg-blue-500/40', type: '正常' },
];

const COMP_SHOTS: ShotBlock[] = [
  { id: 'c1', start: 0, width: 15, color: 'bg-green-500/40', type: '正常' },
  { id: 'c2', start: 15, width: 20, color: 'bg-orange-500/40', type: '变动' },
  { id: 'c3', start: 35, width: 10, color: 'bg-green-500/40', type: '已修正' },
  { id: 'c4', start: 45, width: 55, color: 'bg-blue-500/40', type: '正常' },
];

const INITIAL_PROBLEMS: BaseProblem[] = [
  { id: 'p1', timecode: '00:00:15:04', type: '像素偏移', description: 'Base 与 Comp 版本在边缘存在 2px 的亚像素位移', frames: 'F364 - F382', progress: 15.2, box: { x: 45, y: 30, w: 20, h: 25 } },
  { id: 'p2', timecode: '00:00:35:12', type: '内容风险', description: '检测到未授权的背景品牌 Logo (置信度 94%)', frames: 'F840 - F910', progress: 35.5, box: { x: 25, y: 25, w: 25, h: 20 } },
  { id: 'p3', timecode: '00:00:42:01', type: '色彩断层', description: '暗部区域存在明显的 8bit 压缩带来的色阶断层', frames: 'F1008 - F1050', progress: 42.1, box: { x: 60, y: 55, w: 30, h: 20 } },
  { id: 'p4', timecode: '00:01:12:18', type: '画质抖动', description: '高频纹理区域出现 AI 插帧导致的动态伪影', frames: 'F1728 - F1756', progress: 72.8, box: { x: 30, y: 45, w: 25, h: 30 } },
  { id: 'p5', timecode: '00:02:05:09', type: '物体消失', description: '特效渲染层漏失：背景远景建筑未正常渲染', frames: 'F3000 - F3040', progress: 85.0, box: { x: 70, y: 15, w: 15, h: 12 } },
];

const AuditDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { baseName, compareVersions } = (location.state as { baseName?: string, compareVersions?: Record<string, string> }) || {};
  
  // 状态：当前选中的比对版本 ID
  const [selectedCompareId, setSelectedCompareId] = useState<string>('');

  // 状态：当前正在展示的比对版本名称
  const [targetName, setTargetName] = useState<string | undefined>(undefined);

  // 初始化：默认选中第一个比对版本
  useEffect(() => {
    if (compareVersions && Object.keys(compareVersions).length > 0) {
      const firstId = Object.keys(compareVersions)[0];
      setSelectedCompareId(firstId);
      setTargetName(compareVersions[firstId]);
    }
  }, [compareVersions]);

  // 确认按键回调：切换 targetName
  const handleConfirmCompare = () => {
    if (compareVersions && selectedCompareId) {
      setTargetName(compareVersions[selectedCompareId]);
    }
  };

  // 添加版本选择按键的状态控制
  const [isConfirmed, setIsConfirmed] = useState(false);
  // 设置初始进度为 35.5，以便立使问题 P2 处于激活状态并显示红框
  const [progress, setProgress] = useState(35.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showProblemList, setShowProblemList] = useState(false);
  const [problems, setProblems] = useState<BaseProblem[]>(INITIAL_PROBLEMS);

  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

 // 增加版本对比时的进度状态
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

 //控制版本对比进度的状态转换
  useEffect(() => {
    setIsConfirmed(false);
    setIsLoading(false);
    setLoadingProgress(0);
  }, [selectedCompareId]);

  // 在 selectedCompareId 变化时重置确认状态
  useEffect(() => {
    setIsConfirmed(false);
  }, [selectedCompareId]);

  useEffect(() => {
    let interval: any;
    if (isPlaying && !isDragging) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 0.1));
      }, 42); 
    }
    return () => clearInterval(interval);
  }, [isPlaying, isDragging]);

  const handleScrub = useCallback((clientX: number) => {
    if (!timelineContainerRef.current) return;
    const rect = timelineContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newProgress = (x / rect.width) * 100;
    setProgress(newProgress);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleScrub(e.clientX);
    if (isPlaying) setIsPlaying(false);
  };

  const jumpToProblem = (p: number) => {
    setProgress(p);
    setShowProblemList(false);
    if (isPlaying) setIsPlaying(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const newProblems: BaseProblem[] = lines.slice(1).map((line, idx) => {
        const parts = line.split(',');
        if (parts.length < 5) return null;
        return {
          id: `csv-p-${Date.now()}-${idx}`,
          timecode: parts[0].trim(),
          type: parts[1].trim(),
          description: parts[2].trim(),
          frames: parts[3].trim(),
          progress: parseFloat(parts[4].trim()) || 0,
        };
      }).filter(p => p !== null) as BaseProblem[];

      setProblems(prev => [...prev, ...newProblems]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) handleScrub(e.clientX);
    };
    const onMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, handleScrub]);

  // 获取当前进度下的激活问题点
  const activeProblem = useMemo(() => {
    return problems.find(p => Math.abs(p.progress - progress) < 0.8);
  }, [progress, problems]);

  const renderLinkingLines = () => {
    const baseCutPoints = Array.from(new Set(BASE_SHOTS.flatMap(s => [s.start, s.start + s.width])));
    const compCutPoints = Array.from(new Set(COMP_SHOTS.flatMap(s => [s.start, s.start + s.width])));

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {baseCutPoints.map((p, i) => (
          <g key={`base-link-${i}`}>
            <line 
              x1={`${p}%`} y1="20%" x2={`${p}%`} y2="45%" 
              stroke="#22D3EE" strokeWidth="2" strokeOpacity="0.6"
              filter="url(#lineGlow)"
            />
            <circle cx={`${p}%`} cy="45%" r="2" fill="#22D3EE" />
          </g>
        ))}
        {compCutPoints.map((p, i) => (
          <g key={`comp-link-${i}`}>
            <line 
              x1={`${p}%`} y1="55%" x2={`${p}%`} y2="80%" 
              stroke="#A855F7" strokeWidth="2" strokeOpacity="0.6"
              filter="url(#lineGlow)"
            />
            <circle cx={`${p}%`} cy="55%" r="2" fill="#A855F7" />
          </g>
        ))}
      </svg>
    );
  };

  /**
   * 渲染红色 HUB 探测框组件
   * @param box 坐标宽高
   * @param variant 'simple' (用于左右两侧原图) 或 'hub' (用于中间差异图)
   */
  const renderSpatialHub = (box: BoundingBox, variant: 'simple' | 'hub' = 'simple') => {
    const style: React.CSSProperties = {
      left: `${box.x}%`,
      top: `${box.y}%`,
      width: `${box.w}%`,
      height: `${box.h}%`,
    };

    if (variant === 'simple') {
      return (
        <div 
          className="absolute border border-red-500/80 animate-in fade-in zoom-in duration-300 pointer-events-none shadow-[0_0_10px_rgba(239,68,68,0.3)]" 
          style={style}
        >
          {/* 四角角标 */}
          <div className="absolute -top-px -left-px w-2 h-2 border-l-2 border-t-2 border-red-500" />
          <div className="absolute -top-px -right-px w-2 h-2 border-r-2 border-t-2 border-red-500" />
          <div className="absolute -bottom-px -left-px w-2 h-2 border-l-2 border-b-2 border-red-500" />
          <div className="absolute -bottom-px -right-px w-2 h-2 border-r-2 border-b-2 border-red-500" />
        </div>
      );
    }

    return (
      <div 
        className="absolute border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-in fade-in zoom-in-95 duration-500 pointer-events-none z-20 group/hub overflow-hidden" 
        style={style}
      >
        {/* 强化角标 */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-l-4 border-t-4 border-red-500" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-r-4 border-t-4 border-red-500" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-4 border-b-4 border-red-500" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-4 border-b-4 border-red-500" />
        
        {/* 内部扫描线动画 */}
        <div className="absolute inset-x-0 h-px bg-red-400 shadow-[0_0_8px_red] opacity-40 animate-scan pointer-events-none" />

        {/* HUB 悬浮标签 */}
        <div className="absolute -top-9 left-0 flex items-center gap-2 drop-shadow-xl animate-bounce-slow">
           <div className="bg-red-600 text-white text-[9px] font-black px-2.5 py-1 rounded shadow-lg uppercase tracking-[0.1em] border border-red-400/50 flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
             AI DIFF DETECTED
           </div>
           <div className="bg-black/80 backdrop-blur-md border border-red-500/40 text-red-400 text-[8px] font-mono px-2 py-1 rounded">
             {activeProblem?.type}
           </div>
        </div>

        {/* 中心十字准星 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
           <div className="w-6 h-px bg-red-500" />
           <div className="h-6 w-px bg-red-500 absolute" />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0B] text-white flex flex-col font-sans overflow-hidden select-none">
      {/* Header */}
      <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md z-30">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-tight text-white/90">差异分析工作台 · 空间对齐联动模式</span>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest italic tracking-tighter">
              {baseName || 'BASE'} VS {targetName || 'COMP'}
            </span>
          </div>
        </div>
       
      </header>

      <main className="flex-1 flex flex-col p-6 gap-6 overflow-hidden">
        {/* 下面的内容是多版本的选择 */}
        <div className="relative">
        {compareVersions && Object.keys(compareVersions).length > 0 && (
          <div className="absolute top-6 right-10 z-50 flex items-center gap-3 px-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="relative group">
              <select 
                value={selectedCompareId}
                onChange={(e) => setSelectedCompareId(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-10 text-xs font-bold text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer hover:bg-white/10"
              >
                {Object.entries(compareVersions).map(([id, name]) => (
                  <option key={id} value={id} className="bg-[#141417] text-white">
                    {name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
            {/*添加按键控制*/}
           <button 
                onClick={() => {
                  if (!isConfirmed && !isLoading) {
                    handleConfirmCompare();
                    setIsLoading(true);
                    setLoadingProgress(0);

                    const startTime = Date.now();
                    const duration = 1000;

                    const tick = () => {
                      const elapsed = Date.now() - startTime;
                      const progress = Math.min((elapsed / duration) * 100, 100);
                      setLoadingProgress(progress);
                      if (progress < 100) {
                        requestAnimationFrame(tick);
                      } else {
                        setIsLoading(false);
                        setIsConfirmed(true);
                      }
                    };
                    requestAnimationFrame(tick);
                  }
                }}
                disabled={isConfirmed || isLoading}
                className={`px-6 py-2 rounded-xl text-[10px] font-black shadow-lg active:scale-95 transition-all uppercase tracking-[0.15em] text-white
                  ${isConfirmed || isLoading
                    ? 'bg-gray-600 shadow-none cursor-not-allowed opacity-50' 
                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20 cursor-pointer'
                  }`}
              >
                加载比对版本
          </button>
          </div>
        )}
       </div>
        {/* Timeline Area */}
     <section className="bg-white/5 border border-white/5 rounded-[2.5rem] p-10 shrink-0 shadow-inner group/timeline relative overflow-hidden">
        {renderLinkingLines()}
  
          {/* 
            给外层容器加上 flex flex-col 和 gap-6，用来均匀隔开3个独立的模块。
            所有的鼠标事件和功能性 ref 保持完全不变。
          */}
  <div ref={timelineContainerRef} onMouseDown={onMouseDown} className="cursor-ew-resize relative z-10 flex flex-col gap-6">
    
    {/* ==================== 独立模块 1: 基础镜头组 (BASE_SHOTS) ==================== */}
    <div className="bg-black/20 border border-white/10 rounded-2xl p-5 shadow-sm relative flex flex-col gap-3">
      <div className="flex justify-start">
      <div className="px-2 py-0.5 bg-cyan-600 w-fit rounded text-[9px] font-bold text-white uppercase tracking-wider">
        {baseName || 'Base Version'}
      </div>
      </div>
      <div className="space-y-1.5 pointer-events-none">
        <div className="h-6 w-full bg-white/5 rounded-md flex overflow-hidden relative border border-white/5 shadow-inner">
          {BASE_SHOTS.map(shot => (
            <div key={shot.id} className={`${shot.color} h-full border-r border-black/20`} style={{ width: `${shot.width}%` }}></div>
          ))}
        </div>
      </div>
    </div>

    {/* ==================== 独立模块 2: 问题标记组 (Problems) ==================== */}
    <div className="bg-black/20 border border-white/10 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
       <div className="flex justify-start">
          <div className="px-2 py-0.5 bg-orange-600 w-fit rounded text-[9px] font-bold text-white uppercase tracking-wider">
              AI 自动对比时间索引
            </div>
      </div>
      <div className="h-12 relative flex items-center">
        <div className="absolute inset-x-0 h-3.5 bg-[#151518] rounded-full border border-white/10 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
          {problems.map((prob) => (
            <div 
              key={prob.id}
              className={`absolute top-0 bottom-0 w-1 transition-all ${
                prob.type.includes('风险') ? 'bg-red-500 shadow-[0_0_12px_red]' : 
                prob.type.includes('偏移') ? 'bg-orange-500 shadow-[0_0_12px_orange]' : 'bg-cyan-400'
              }`}
              style={{ left: `${prob.progress}%` }}
            />
          ))}
        </div>
      </div>
    </div>

    {/* ==================== 独立模块 3: 合成镜头组 (COMP_SHOTS) ==================== */}
    {/* 加载进度条 */}
     {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-300">
          {/* 背景遮罩 */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* 弹出窗口 */}
          <div className="relative z-10 bg-[#1a1a1f] border border-white/10 rounded-2xl px-10 py-8 flex flex-col items-center gap-5 shadow-2xl min-w-[320px] animate-in zoom-in-95 fade-in duration-300">
            
            {/* 标题 */}
            <p className="text-sm font-bold text-gray-300 tracking-widest">
              正在对比，您可以关闭窗口，自动对比完成后将用站内信通知您<span className="animate-pulse">......</span>
            </p>

            {/* 进度条 */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-none"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>

            {/* 进度百分比 */}
            <p className="text-xs text-gray-500 font-mono">
              {Math.floor(loadingProgress)}%
            </p>

          </div>
        </div>
      )}
    {selectedCompareId && isConfirmed && (
        <div className="bg-black/20 border border-white/10 rounded-2xl p-5 shadow-sm flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="flex justify-start">
            <div className="px-2 py-0.5 bg-purple-600 w-fit rounded text-[9px] font-bold text-white uppercase tracking-wider">
              {targetName || 'Comp Version'}
            </div>
          </div>
          <div className="space-y-1.5 pointer-events-none">
            <div className="h-6 w-full bg-white/5 rounded-md flex overflow-hidden relative border border-white/5 shadow-inner">
              {COMP_SHOTS.map(shot => (
                <div key={shot.id} className={`${shot.color} h-full border-r border-black/20`} style={{ width: `${shot.width}%` }}></div>
              ))}
            </div>
          </div>
        </div>
      )}
    {/* ==================== 全局游标 (Playhead) ==================== */}
    {/* 游标的绝对定位依然基于 timelineContainerRef，因此能完美贯穿这3个独立的模块 */}
    <div 
      className={`absolute top-[-10px] bottom-[-10px] w-px z-20 pointer-events-none bg-white shadow-[0_0_15px_white]`}
      style={{ left: `${progress}%` }}
    >
      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full border-2 border-black bg-white"></div>
      <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full border-2 border-black bg-white"></div>
    </div>
  </div>
</section>


        {/* Controls */}
        <section className="flex items-center justify-center gap-4 shrink-0 px-10">
           <button 
             onClick={() => window.open(`#/analysis/${id}?baseName=${encodeURIComponent(baseName || '')}`, '_blank')} 
             className="px-6 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white hover:bg-white/20 transition-all flex items-center gap-2"
           >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
              {baseName || 'Base'} 影片分析
          </button>
           <button onClick={() => setIsPlaying(!isPlaying)} className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-bold text-xs transition-all shadow-xl ${isPlaying ? 'bg-orange-500 text-white' : 'bg-white text-black hover:scale-105 active:scale-95'}`}>
              {isPlaying ? '暂停推理' : '自动播放'}
           </button>
           <button onClick={() => setShowProblemList(true)} className="px-6 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white hover:bg-white/20 transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
              异常索引
           </button>
           {!isLoading && isConfirmed && (
             <>
                <button 
                  onClick={() => window.open(`#/analysis/${selectedCompareId}?baseName=${encodeURIComponent(targetName || '')}`, '_blank')} 
                  className="px-6 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                  {targetName || 'Comp'} 影片分析
                </button>
                <button className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold hover:bg-white/10 transition-all uppercase tracking-widest">导出数据</button>
                <button onClick={() => navigate(`/final-confirm/${id}`)} className="px-6 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all uppercase tracking-widest">确认审定</button>
             </>
           )}
         
        </section>
         
        {/* Triple View Area */}
        <section className="flex-1 grid grid-cols-3 gap-6 min-h-0">
          {/* 1. Base Reference */}
          <div className="flex flex-col gap-3">
             <div className="flex-1 rounded-[2.5rem] bg-black border border-white/5 overflow-hidden relative shadow-2xl group">
                <img src={`https://picsum.photos/seed/base_${Math.floor(progress)}/1280/720`} className="w-full h-full object-cover opacity-80" alt="Base" />
                {activeProblem?.box && renderSpatialHub(activeProblem.box, 'simple')}
                <div className="absolute top-6 left-6 px-3 py-1 bg-black/60 backdrop-blur-md rounded-xl text-[10px] font-bold text-white border border-white/10 tracking-widest uppercase">{baseName}</div>
             </div>
          </div>
          
          {/* 2. Difference Hub (中间屏显示红色大探测框) */}
          <div className="flex flex-col gap-3">
             <div className="flex-1 rounded-[2.5rem] bg-[#111113] border border-cyan-500/20 overflow-hidden relative shadow-[0_0_50px_rgba(34,211,238,0.15)] group">
                <div className="absolute inset-0">
                   <img src={`https://picsum.photos/seed/base_${Math.floor(progress)}/1280/720`} className="w-full h-full object-cover opacity-50 grayscale" alt="Base" />
                   <img src={`https://picsum.photos/seed/base_${Math.floor(progress)}/1280/720`} className="absolute inset-0 w-full h-full object-cover mix-blend-difference opacity-80" alt="Comp" />
                </div>
                {/* 触发红色 HUB 探测框 */}
                {activeProblem?.box && renderSpatialHub(activeProblem.box, 'hub')}
                
                <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-cyan-600/90 backdrop-blur-md rounded-2xl text-[10px] font-black text-white shadow-2xl border border-white/20 tracking-[0.2em] uppercase text-center">不同点叠加显示</div>
             </div>
          </div>

          {/* 3. Compare Target */}
          <div className="flex flex-col gap-3">
             <div className="flex-1 rounded-[2.5rem] bg-black border border-white/5 overflow-hidden relative shadow-2xl group">
                <img src={`https://picsum.photos/seed/base_${Math.floor(progress)}/1280/720`} className="w-full h-full object-cover opacity-80" alt="Comp" />
                {activeProblem?.box && renderSpatialHub(activeProblem.box, 'simple')}
                <div className="absolute top-6 right-6 px-3 py-1 bg-purple-600/60 backdrop-blur-md rounded-xl text-[10px] font-bold text-white border border-white/10 tracking-widest uppercase">{targetName}</div>
             </div>
          </div>
        </section>
      </main>

      <footer className="h-14 bg-white/5 border-t border-white/5 px-10 flex items-center justify-between shrink-0 text-gray-400">
         <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">AI Status</span>
            <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${activeProblem ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
               {activeProblem ? `Detected: ${activeProblem.description}` : 'Pixel Alignment Locked'}
            </div>
         </div>
         <div className="flex items-center gap-6 text-[10px] font-bold uppercase font-mono">
            <span>TC: {Math.floor((progress/100)*23904)} FRAMES</span>
            <span>Accuracy: 99.8%</span>
         </div>
      </footer>

      {showProblemList && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-2xl animate-in fade-in duration-500">
           <div className="w-full max-w-4xl bg-[#141417] border border-white/10 rounded-[3rem] shadow-3xl flex flex-col overflow-hidden max-h-[80vh] animate-in zoom-in-95 duration-500">
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
                 <h2 className="text-3xl font-bold tracking-tight">异常空间点索引</h2>
                 <button onClick={() => setShowProblemList(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                 </button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                 <table className="w-full text-left">
                    <tbody className="divide-y divide-white/5">
                       {problems.map((prob) => (
                          <tr key={prob.id} onClick={() => jumpToProblem(prob.progress)} className="hover:bg-white/5 transition-colors cursor-pointer group">
                             <td className="px-10 py-8 font-mono font-bold text-cyan-400">{prob.timecode}</td>
                             <td className="px-10 py-8">
                                <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${prob.type.includes('风险') ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                   {prob.type}
                                </span>
                             </td>
                             <td className="px-10 py-8 text-sm text-gray-300 leading-relaxed">{prob.description}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          50% { opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan { animation: scan 2s linear infinite; }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}} />
    </div>
  );
};

export default AuditDetail;
