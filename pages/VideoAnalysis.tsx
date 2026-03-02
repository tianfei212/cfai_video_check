import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const TOTAL_FRAMES = 23904;
const TOTAL_SECONDS = 195; // 3:15

interface Shot {
  id: string;
  startTime: number;
  endTime: number;
  thumbId: number;
  videoUrl: string;
}

interface SelectionBox {
  startX: number;
  startY: number;
  width: number;
  height: number;
}

interface ManualTag {
  id: string;
  box: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  label: string;
  type: string;
  progress: number;
  timecode: string;
}

interface HistoryLog {
  id: string;
  time: string;
  progress: number;
  action: string;
  user: 'AI' | '专家';
  details: string;
}

interface VideoAnalysisProps {
  id?: string;
  baseName?: string;
  onClose?: () => void;
  isModal?: boolean;
}

const VideoAnalysis: React.FC<VideoAnalysisProps> = ({ id: propsId, baseName: propsBaseName, onClose, isModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: paramsId } = useParams();
  
  // 从 state 或 URL 查询参数中获取 baseName
  const state = location.state as { baseName?: string } | null;
  const searchParams = new URLSearchParams(location.search);
  const queryBaseName = searchParams.get('baseName');
  
  const id = propsId || paramsId;
  const MOVIE_NAME = propsBaseName || state?.baseName || queryBaseName || "流浪地球3";
  
  const [progress, setProgress] = useState(42.5);
  const [isDragging, setIsDragging] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'detection' | 'history'>('detection');
  
  // 核心镜头状态
  const [shots, setShots] = useState<Shot[]>(() => {
    return [...Array(15)].map((_, i) => {
      const shotNumber = String(i + 1).padStart(2, '0');
      return {
        id: `shot-${i}-${Math.random()}`,
        startTime: (i / 15) * 100,
        endTime: ((i + 1) / 15) * 100,
        thumbId: 100 + i,
        videoUrl: `/videos/${MOVIE_NAME}-${shotNumber}.mp4`
      };
    });
  });

  // 多选状态
  const [selectedShotIds, setSelectedShotIds] = useState<Set<string>>(new Set());

  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([
    { id: 'h1', time: '14:20:05', progress: 0, action: '系统启动', user: 'AI', details: '全量深度语义扫描已开启' },
    { id: 'h2', time: '14:20:12', progress: 10, action: '主体识别', user: 'AI', details: '识别到核心人物 A (置信度 99%)' },
  ]);

  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [isTabPressed, setIsTabPressed] = useState(false);
  const [isCmdOrCtrlPressed, setIsCmdOrCtrlPressed] = useState(false);
  const [isRiskDismissed, setIsRiskDismissed] = useState(false); 
  const [toast, setToast] = useState<{msg: string, type: 'split' | 'merge' | 'dismiss' | 'tag' | 'export'} | null>(null);

  const [isSelectingArea, setIsSelectingArea] = useState(false);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [manualTags, setManualTags] = useState<ManualTag[]>([]);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [tempTagData, setTempTagData] = useState({ label: '', type: '敏感标志' });

  const timelineRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const isManualTagMode = isTabPressed && isCmdOrCtrlPressed;

  // 获取当前正在播放的镜头
  const currentShot = useMemo(() => {
    return shots.find(s => progress >= s.startTime && progress <= s.endTime) || shots[0];
  }, [shots, progress]);

  // 同步视频播放状态和进度
   useEffect(() => {
     if (!videoRef.current || isPlaying) return;
     
     const shotDurationPercent = currentShot.endTime - currentShot.startTime;
     const progressInShot = (progress - currentShot.startTime) / shotDurationPercent;
     
     if (videoRef.current.duration) {
       const targetTime = progressInShot * videoRef.current.duration;
       if (Math.abs(videoRef.current.currentTime - targetTime) > 0.1) {
         videoRef.current.currentTime = targetTime;
       }
     }
   }, [progress, currentShot, isPlaying]);

   useEffect(() => {
     if (!videoRef.current) return;
     if (isPlaying) {
       // 播放前确保进度同步
       const shotDurationPercent = currentShot.endTime - currentShot.startTime;
       const progressInShot = (progress - currentShot.startTime) / shotDurationPercent;
       if (videoRef.current.duration) {
          videoRef.current.currentTime = progressInShot * videoRef.current.duration;
       }
       videoRef.current.play().catch(() => setIsPlaying(false));
     } else {
       videoRef.current.pause();
     }
   }, [isPlaying, currentShot]);

  useEffect(() => {
    let interval: any;
    if (isPlaying && videoRef.current) {
      interval = setInterval(() => {
        if (videoRef.current && videoRef.current.duration) {
          const shotDurationPercent = currentShot.endTime - currentShot.startTime;
          const progressInShot = videoRef.current.currentTime / videoRef.current.duration;
          const newProgress = currentShot.startTime + (progressInShot * shotDurationPercent);
          setProgress(Math.min(currentShot.endTime, newProgress));
          
          // 如果当前片段播放结束，自动暂停（或可以考虑自动播放下一段）
          if (videoRef.current.ended || videoRef.current.currentTime >= videoRef.current.duration - 0.1) {
             setIsPlaying(false);
          }
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentShot]);

  // 键盘监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { 
      if (e.key === 'Tab') { e.preventDefault(); setIsTabPressed(true); }
      if (e.key === 'Shift') setIsShiftPressed(true);
      if (e.key === 'Meta' || e.key === 'Control') setIsCmdOrCtrlPressed(true);
      if (e.code === 'Space') { e.preventDefault(); setIsPlaying(prev => !prev); }
    };
    const handleKeyUp = (e: KeyboardEvent) => { 
      if (e.key === 'Tab') setIsTabPressed(false); 
      if (e.key === 'Shift') setIsShiftPressed(false);
      if (e.key === 'Meta' || e.key === 'Control') setIsCmdOrCtrlPressed(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const formatTimecode = (p: number) => {
    const totalMs = (p / 100) * TOTAL_SECONDS * 1000;
    const date = new Date(totalMs);
    const mm = String(date.getUTCMinutes()).padStart(2, '0');
    const ss = String(date.getUTCSeconds()).padStart(2, '0');
    const ff = String(Math.floor((totalMs % 1000) / 41)).padStart(2, '0');
    return `00:${mm}:${ss}:${ff}`;
  };

  const currentFrame = Math.floor((progress / 100) * TOTAL_FRAMES);

  const addLog = (action: string, user: 'AI' | '专家', details: string, prog: number = progress) => {
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];
    setHistoryLogs(prev => [{ id: Date.now().toString(), time, progress: prog, action, user, details }, ...prev]);
  };

  // 镜头拆分逻辑
  const splitShotAt = (p: number) => {
    setShots(prev => {
      const shotIndex = prev.findIndex(s => p > s.startTime && p < s.endTime);
      if (shotIndex === -1) return prev;
      
      const target = prev[shotIndex];
      const uniqueSuffix = Math.floor(Math.random() * 10000);
      const shotA: Shot = { ...target, id: `shot-${Date.now()}-${uniqueSuffix}-A`, endTime: p };
      const shotB: Shot = { ...target, id: `shot-${Date.now()}-${uniqueSuffix}-B`, startTime: p, thumbId: target.thumbId + 100 };
      
      const nextShots = [...prev];
      nextShots.splice(shotIndex, 1, shotA, shotB);
      return nextShots.sort((a, b) => a.startTime - b.startTime);
    });
    addLog('镜头拆分', '专家', `在 ${formatTimecode(p)} 处进行了手动镜头分割`, p);
    setToast({ msg: '镜头已成功拆分', type: 'split' });
    setTimeout(() => setToast(null), 3000);
  };

  // 镜头合并逻辑
  const mergeSelectedShots = () => {
    if (selectedShotIds.size < 2) return;
    
    setShots(prev => {
      const selectedShots = prev.filter(s => selectedShotIds.has(s.id));
      if (selectedShots.length < 2) return prev;

      // 寻找范围
      const minStart = Math.min(...selectedShots.map(s => s.startTime));
      const maxEnd = Math.max(...selectedShots.map(s => s.endTime));
      
      const mergedShot: Shot = {
        ...selectedShots[0],
        id: `merged-${Date.now()}`,
        startTime: minStart,
        endTime: maxEnd,
        thumbId: selectedShots[0].thumbId
      };

      // 移除旧镜头，插入新镜头
      const others = prev.filter(s => !selectedShotIds.has(s.id));
      const final = [...others, mergedShot].sort((a, b) => a.startTime - b.startTime);
      return final;
    });

    addLog('镜头合并', '专家', `合并了 ${selectedShotIds.size} 个镜头分段`, progress);
    setSelectedShotIds(new Set());
    setToast({ msg: '镜头已合并完成', type: 'merge' });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleShotSelection = (id: string) => {
    setSelectedShotIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 视频交互点击处理
  const handleVideoMouseDown = (e: React.MouseEvent) => {
    if (isManualTagMode && videoContainerRef.current) {
      const rect = videoContainerRef.current.getBoundingClientRect();
      setIsSelectingArea(true);
      setSelectionBox({
        startX: e.clientX - rect.left,
        startY: e.clientY - rect.top,
        width: 0,
        height: 0
      });
      return;
    }

    if (isCmdOrCtrlPressed && !isTabPressed && progress > 40 && progress < 45 && !isRiskDismissed) {
      setIsRiskDismissed(true);
      addLog('误报排除', '专家', `移除了位于 ${formatTimecode(progress)} 的敏感标志风险`);
      setToast({ msg: '已人工标记该风险为“误报”', type: 'dismiss' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleVideoMouseMove = (e: React.MouseEvent) => {
    if (isSelectingArea && selectionBox && videoContainerRef.current) {
      const rect = videoContainerRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      setSelectionBox({
        ...selectionBox,
        width: currentX - selectionBox.startX,
        height: currentY - selectionBox.startY
      });
    }
  };

  const handleVideoMouseUp = () => {
    if (isSelectingArea && selectionBox) {
      if (Math.abs(selectionBox.width) > 10 && Math.abs(selectionBox.height) > 10) {
        setShowTagModal(true);
      } else {
        setSelectionBox(null);
      }
      setIsSelectingArea(false);
    }
  };

  const submitManualTag = () => {
    if (!selectionBox || !videoContainerRef.current) return;
    const rect = videoContainerRef.current.getBoundingClientRect();
    const left = (Math.min(selectionBox.startX, selectionBox.startX + selectionBox.width) / rect.width) * 100;
    const top = (Math.min(selectionBox.startY, selectionBox.startY + selectionBox.height) / rect.height) * 100;
    const width = (Math.abs(selectionBox.width) / rect.width) * 100;
    const height = (Math.abs(selectionBox.height) / rect.height) * 100;

    const newTag: ManualTag = {
      id: `manual-${Date.now()}`,
      box: { left, top, width, height },
      label: tempTagData.label || '人工标记',
      type: tempTagData.type,
      progress: progress,
      timecode: formatTimecode(progress)
    };

    setManualTags(prev => [newTag, ...prev]);
    addLog('新增标记', '专家', `在 ${newTag.timecode} 添加了 [${newTag.type}] 标记`);
    setShowTagModal(false);
    setSelectionBox(null);
    setTempTagData({ label: '', type: '敏感标志' });
    setToast({ msg: `已保存人工标记：${newTag.label}`, type: 'tag' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleScrub = useCallback((clientX: number) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const trackStart = 76;
    const trackEnd = rect.width - 16;
    const trackWidth = trackEnd - trackStart;
    const xRelative = clientX - rect.left;
    const newProgress = Math.max(0, Math.min(100, ((xRelative - trackStart) / trackWidth) * 100));
    
    if (!isCmdOrCtrlPressed && !isShiftPressed && !isTabPressed) {
      setProgress(newProgress);
    }
  }, [isCmdOrCtrlPressed, isShiftPressed, isTabPressed]);

  const onTimelineMouseDown = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const trackStart = 76;
    const trackEnd = rect.width - 16;
    const trackWidth = trackEnd - trackStart;
    const xRelative = e.clientX - rect.left;
    const p = Math.max(0, Math.min(100, ((xRelative - trackStart) / trackWidth) * 100));

    // 如果按住 shift 或 tab (未按 cmd)，执行拆分
    if (isShiftPressed || (isTabPressed && !isCmdOrCtrlPressed)) {
      splitShotAt(p);
      return;
    }

    if (!isTabPressed && !isCmdOrCtrlPressed) setIsDragging(true);
    handleScrub(e.clientX);
  };

  useEffect(() => {
    const onGlobalMouseMove = (e: MouseEvent) => { if (isDragging) handleScrub(e.clientX); };
    const onGlobalMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mousemove', onGlobalMouseMove);
      window.addEventListener('mouseup', onGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onGlobalMouseMove);
      window.removeEventListener('mouseup', onGlobalMouseUp);
    };
  }, [isDragging, handleScrub]);

  const cursorClass = useMemo(() => {
    if (isShiftPressed) return 'cursor-split';
    if (isManualTagMode) return 'cursor-tag';
    if (isTabPressed) return 'cursor-crosshair';
    if (isCmdOrCtrlPressed) return 'cursor-dismiss';
    return '';
  }, [isTabPressed, isCmdOrCtrlPressed, isManualTagMode, isShiftPressed]);

  return (
    <div className={`${isModal ? 'relative h-full w-full' : 'fixed inset-0'} bg-[#0A0A0B] text-white flex flex-col font-sans overflow-hidden select-none ${cursorClass}`}>
      {/* 顶部工具栏 */}
      <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md z-30">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => isModal && onClose ? onClose() : navigate(-1)} 
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isModal ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
              )}
            </svg>
          </button>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-tight text-white/90">{MOVIE_NAME} - 专家审核工作台</span>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest italic">CAF-AI 智能分析系统 v4.2.3</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1 border rounded-full transition-all duration-300 ${isTabPressed || isCmdOrCtrlPressed || isShiftPressed ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isTabPressed || isCmdOrCtrlPressed || isShiftPressed ? 'bg-blue-400 shadow-[0_0_8px_cyan]' : 'bg-green-500 animate-pulse'}`}></div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              {isShiftPressed ? '拆分模式 (Shift)' : isManualTagMode ? '区域框选模式 (Tab + Cmd/Ctrl)' : isTabPressed ? '拆分模式 (Tab)' : isCmdOrCtrlPressed ? '多选/解除模式 (Ctrl/Cmd)' : 'AI 核心已就绪'}
            </span>
          </div>
          <button 
            onClick={() => setShowExportModal(true)}
            className="px-5 py-1.5 bg-blue-600 hover:bg-blue-500 text-[11px] font-bold rounded-lg transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            导出分析序列
          </button>
        </div>
      </header>

      {/* 主体工作区 */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col relative bg-black">
          {/* 视频画面区 */}
          <div 
            ref={videoContainerRef}
            onMouseDown={handleVideoMouseDown}
            onMouseMove={handleVideoMouseMove}
            onMouseUp={handleVideoMouseUp}
            className={`flex-1 relative flex items-center justify-center overflow-hidden transition-colors duration-300 ${isManualTagMode ? 'bg-indigo-500/5' : isCmdOrCtrlPressed ? 'bg-blue-500/5' : ''}`}
          >
            <video 
              ref={videoRef}
              src={currentShot.videoUrl} 
              className="w-full h-full object-contain opacity-95 pointer-events-none" 
              playsInline
              muted // 默认静音以支持自动播放或避免打扰
              onLoadedMetadata={() => {
                // 当 metadata 加载后，同步一次进度
                if (videoRef.current) {
                  const shotDurationPercent = currentShot.endTime - currentShot.startTime;
                  const progressInShot = (progress - currentShot.startTime) / shotDurationPercent;
                  videoRef.current.currentTime = progressInShot * videoRef.current.duration;
                }
              }}
            />
            
            {/* 播放/暂停 悬浮按钮 */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center pointer-events-auto active:scale-90 transition-transform"
              >
                {isPlaying ? (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                ) : (
                  <svg className="w-8 h-8 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
            </div>
            
            {/* AI 侦测框 */}
            {progress > 40 && progress < 45 && !isRiskDismissed && (
              <div className={`absolute top-[25%] left-[40%] w-32 h-32 border-2 rounded transition-all duration-300 shadow-2xl ${isCmdOrCtrlPressed && !isTabPressed ? 'border-dashed border-blue-400 bg-blue-400/10 scale-105' : 'border-red-500 bg-red-500/10'}`}>
                <div className={`absolute -top-6 left-0 text-[9px] font-bold px-1.5 py-0.5 whitespace-nowrap flex items-center gap-1.5 transition-colors ${isCmdOrCtrlPressed && !isTabPressed ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}`}>
                   {isCmdOrCtrlPressed && !isTabPressed ? '点击解除此标记' : '[风险] 敏感标志检测: 88.2%'}
                </div>
              </div>
            )}

            {/* 人工标记 */}
            {manualTags.map(tag => {
              const isVisible = Math.abs(progress - tag.progress) < 2;
              if (!isVisible) return null;
              return (
                <div 
                  key={tag.id}
                  className="absolute border-2 border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.3)] animate-in zoom-in duration-300"
                  style={{ left: `${tag.box.left}%`, top: `${tag.box.top}%`, width: `${tag.box.width}%`, height: `${tag.box.height}%` }}
                >
                   <div className="absolute -top-6 left-0 bg-indigo-600 text-[8px] font-bold px-1.5 py-0.5 whitespace-nowrap text-white flex items-center gap-1 shadow-lg">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                      {tag.type}: {tag.label} (人工)
                   </div>
                </div>
              );
            })}

            {/* 正在框选 */}
            {(isSelectingArea || selectionBox) && selectionBox && (
              <div 
                className="absolute border-2 border-indigo-400 bg-indigo-500/10 shadow-[0_0_20px_rgba(129,140,248,0.3)] pointer-events-none z-40"
                style={{
                  left: Math.min(selectionBox.startX, selectionBox.startX + selectionBox.width),
                  top: Math.min(selectionBox.startY, selectionBox.startY + selectionBox.height),
                  width: Math.abs(selectionBox.width),
                  height: Math.abs(selectionBox.height)
                }}
              />
            )}

            <div className="absolute bottom-6 left-8 flex flex-col gap-1 pointer-events-none z-10">
               <span className="text-3xl font-mono font-bold tracking-tighter text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">{formatTimecode(progress)}</span>
               <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em] drop-shadow-md">Frame Index: {currentFrame} / {TOTAL_FRAMES}</span>
            </div>

            {/* Toast */}
            {toast && (
              <div className="absolute top-10 left-1/2 -translate-x-1/2 apple-blur border border-white/10 px-6 py-3 rounded-full flex items-center gap-3 animate-in fade-in slide-in-from-top-4 shadow-2xl z-50">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.type === 'tag' || toast.type === 'merge' ? 'bg-indigo-500' : toast.type === 'split' ? 'bg-amber-500' : 'bg-blue-500'}`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                 </div>
                 <span className="text-xs font-bold tracking-tight text-white">{toast.msg}</span>
              </div>
            )}
          </div>

          {/* 交互时间轴 */}
          <div className="h-64 border-t border-white/5 bg-[#0D0D0F] p-4 flex flex-col gap-4 relative">
             {/* 合并操作浮层 */}
             {selectedShotIds.size >= 2 && (
               <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-2">
                 <button 
                  onClick={mergeSelectedShots}
                  className="px-6 py-2 bg-indigo-600 text-white text-[10px] font-bold rounded-full shadow-2xl shadow-indigo-600/40 hover:bg-indigo-500 transition-all flex items-center gap-2 border border-indigo-400/50"
                 >
                   <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h8m0 0l-4-4m4 4l-4 4m0 6H8m0 0l4 4m-4-4l4-4"/></svg>
                   合并所选 {selectedShotIds.size} 个镜头
                 </button>
               </div>
             )}

             <div ref={timelineRef} onMouseDown={onTimelineMouseDown} className="space-y-2 cursor-pointer py-2 relative h-20">
                <div className="flex items-center gap-3 h-4">
                   <span className="w-16 text-[10px] font-bold text-gray-500 tracking-tighter shrink-0 uppercase">Risk Index</span>
                   <div className="flex-1 h-full bg-white/5 rounded-sm relative overflow-hidden">
                      {manualTags.map(tag => (
                        <div key={tag.id} className="absolute h-full w-0.5 bg-indigo-400 shadow-[0_0_8px_indigo]" style={{ left: `${tag.progress}%` }} />
                      ))}
                      {!isRiskDismissed && <div className="absolute left-[42%] w-[1.5%] h-full bg-red-500/80"></div>}
                      {isRiskDismissed && <div className="absolute left-[42%] w-[1.5%] h-full bg-blue-500/40 animate-pulse"></div>}
                   </div>
                </div>
                <div className="flex items-center gap-3 h-4">
                   <span className="w-16 text-[10px] font-bold text-gray-500 tracking-tighter shrink-0 uppercase">Composition</span>
                   <div className="flex-1 h-full bg-white/5 rounded-sm relative flex overflow-hidden">
                      {shots.map((shot, idx) => {
                        const isSelected = selectedShotIds.has(shot.id);
                        return (
                          <div 
                            key={shot.id} 
                            className={`h-full border-r border-black/20 transition-all duration-300 ${isSelected ? 'bg-indigo-500/40 border-indigo-400' : idx % 2 === 0 ? 'bg-green-500/10' : 'bg-green-500/20'}`} 
                            style={{ width: `${shot.endTime - shot.startTime}%` }} 
                          />
                        );
                      })}
                   </div>
                </div>
                <div className={`absolute top-0 bottom-0 w-px z-20 transition-transform duration-75 ease-out pointer-events-none ${isShiftPressed ? 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : isManualTagMode ? 'bg-indigo-400 shadow-[0_0_20px_indigo]' : 'bg-white shadow-[0_0_10px_white]'}`} style={{ left: `calc(76px + ${progress} * (100% - 76px - 16px) / 100)` }}>
                  <div className={`absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full border-2 border-black ${isShiftPressed ? 'bg-amber-400' : isManualTagMode ? 'bg-indigo-400' : 'bg-white'}`}></div>
                </div>
             </div>
             <div className="flex-1 flex gap-1 items-center overflow-x-auto no-scrollbar px-1 min-h-[80px]">
                {shots.map((shot) => {
                  const isActive = progress >= shot.startTime && progress < shot.endTime;
                  const isSelected = selectedShotIds.has(shot.id);
                  return (
                    <div 
                      key={shot.id} 
                      onClick={() => {
                        if (isCmdOrCtrlPressed) {
                          toggleShotSelection(shot.id);
                        } else {
                          setProgress(shot.startTime + (shot.endTime - shot.startTime) / 2);
                        }
                      }} 
                      className={`h-full rounded-md overflow-hidden border transition-all duration-300 cursor-pointer relative shrink-0 ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/50 scale-105 z-20 opacity-100' : isActive ? 'border-blue-500 ring-1 ring-blue-500/30 scale-105 z-10 opacity-100' : 'border-white/5 opacity-50 hover:opacity-100'}`} 
                      style={{ width: `${Math.max(65, (shot.endTime - shot.startTime) * 10)}px` }}
                    >
                       <img src={`https://picsum.photos/seed/${shot.thumbId}/200/100`} className="w-full h-full object-cover" alt="shot" />
                       {isSelected && (
                         <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                            <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                               <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                            </div>
                         </div>
                       )}
                    </div>
                  );
                })}
             </div>
          </div>
        </div>

        {/* 右侧：AI 侧边栏 */}
        <aside className="w-80 border-l border-white/5 bg-[#0D0D0F] flex flex-col z-10 shadow-2xl overflow-hidden">
          <div className="p-5 border-b border-white/5 bg-black/20">
             <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Analysis & Markers</h3>
             <div className="bg-white/5 p-1 rounded-xl flex gap-1 border border-white/5">
                <button 
                  onClick={() => setSidebarTab('detection')}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold tracking-widest transition-all ${sidebarTab === 'detection' ? 'bg-white/15 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  DETECTION
                </button>
                <button 
                  onClick={() => setSidebarTab('history')}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold tracking-widest transition-all ${sidebarTab === 'history' ? 'bg-white/15 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  HISTORY
                </button>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
             {sidebarTab === 'detection' ? (
               <>
                 {manualTags.map(tag => (
                   <div key={tag.id} onClick={() => setProgress(tag.progress)} className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5 cursor-pointer hover:bg-indigo-500/10 transition-all relative overflow-hidden animate-in slide-in-from-right-2">
                      <div className="flex justify-between items-start mb-2">
                         <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-[8px] font-bold text-white uppercase tracking-tighter">人工校验标记</span>
                         <span className="text-[9px] font-mono text-indigo-400">{tag.timecode}</span>
                      </div>
                      <h4 className="text-sm font-bold text-indigo-100 mb-1">{tag.label}</h4>
                      <p className="text-[9px] text-indigo-400/70 font-bold uppercase tracking-widest italic">{tag.type}</p>
                   </div>
                 ))}
                 {[
                   { id: 1, type: 'CORE ACTOR', label: '主要人物 A', conf: 0.99, time: '00:00:12:04', p: 10 },
                   { id: 2, type: 'SENSITIVE', label: '疑似品牌 Logo', conf: 0.88, time: '00:00:42:15', p: 42.5, isDismissed: isRiskDismissed },
                 ].map((item) => (
                   <div key={item.id} onClick={() => setProgress(item.p)} className={`p-4 rounded-xl border cursor-pointer transition-all ${Math.abs(progress - item.p) < 3 ? 'bg-blue-600/10 border-blue-500/50' : 'bg-white/5 border-white/10'} ${item.isDismissed ? 'opacity-30' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                         <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${item.type === 'SENSITIVE' ? 'bg-red-500' : 'bg-blue-500/20 text-blue-400'}`}>{item.type}</span>
                         <span className="text-[9px] font-mono text-gray-500">{item.time}</span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-200">{item.label}</h4>
                   </div>
                 ))}
               </>
             ) : (
               <div className="space-y-6 pl-4 relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/5" />
                  {historyLogs.map((log) => (
                    <div key={log.id} onClick={() => setProgress(log.progress)} className="relative pl-6 group cursor-pointer">
                       <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#0D0D0F] z-10 transition-transform group-hover:scale-125 ${log.user === 'AI' ? 'bg-blue-500' : 'bg-indigo-500'}`} />
                       <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                             <span className="text-[9px] font-mono text-gray-500 tracking-widest">{log.time}</span>
                             <span className={`text-[8px] font-bold px-1 py-0.5 rounded border transition-colors ${log.user === 'AI' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>BY {log.user}</span>
                          </div>
                          <h5 className="text-[11px] font-bold text-white/90">{log.action}</h5>
                          <p className="text-[10px] text-gray-500 leading-relaxed">{log.details}</p>
                          <div className="mt-1 inline-flex items-center gap-1.5 text-[8px] font-mono text-gray-600 font-bold uppercase tracking-tighter group-hover:text-blue-400 transition-colors">
                             <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg>
                             {formatTimecode(log.progress)}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
             )}
          </div>
          <div className="p-5 bg-black/40 border-t border-white/5">
             <button 
                onClick={() => navigate(`/final-confirm/${id}`)}
                className="w-full py-3 bg-white text-black text-[11px] font-bold rounded-xl hover:bg-gray-200 active:scale-95 transition-all"
              >
                确认并提交终审
              </button>
          </div>
        </aside>
      </div>

      {/* 导出弹窗 */}
      {showExportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-6 animate-in fade-in duration-300">
           <div className="w-full max-w-lg bg-[#1D1D1F] border border-white/10 rounded-[2.5rem] p-10 shadow-3xl animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-start mb-8">
                 <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">导出审核分析序列</h2>
                    <p className="text-xs text-gray-500 font-medium">生成加密的 CSV 报告，包含所有专家标注与 AI 推理历史。</p>
                 </div>
                 <button 
                  onClick={() => setShowExportModal(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500"
                 >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                 </button>
              </div>
              <div className="space-y-6 mb-10">
                 <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                    <div className="flex-1">
                       <p className="text-sm font-bold">CAFAI_Audit_Log.csv</p>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">序列数据 · {manualTags.length + historyLogs.length} 条记录</p>
                    </div>
                 </div>
              </div>
              <div className="flex gap-4">
                 <button onClick={() => setShowExportModal(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold transition-all text-gray-400">放弃并关闭</button>
                 <button onClick={() => setShowExportModal(false)} className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-xs font-bold transition-all shadow-xl shadow-blue-600/20">确认导出 CSV</button>
              </div>
           </div>
        </div>
      )}

      {/* 人工标记弹窗 */}
      {showTagModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
           <div className="apple-card w-full max-w-md bg-[#1D1D1F] border border-white/10 p-8 shadow-3xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                 </div>
                 人工标记与备注
              </h2>
              <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">标记类别</label>
                    <div className="grid grid-cols-2 gap-2">
                       {['敏感标志', '人物身份', '版权侵权', '构图建议'].map(type => (
                          <button key={type} onClick={() => setTempTagData({ ...tempTagData, type })} className={`py-2 px-3 rounded-xl text-[10px] font-bold border transition-all ${tempTagData.type === type ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}>{type}</button>
                       ))}
                    </div>
                 </div>
                 <div>
                    <textarea 
                       autoFocus
                       value={tempTagData.label}
                       onChange={(e) => setTempTagData({ ...tempTagData, label: e.target.value })}
                       placeholder="请输入审核意见..."
                       className="w-full h-24 bg-black/40 border border-white/5 rounded-2xl p-4 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                    />
                 </div>
                 <div className="flex gap-3 pt-2">
                    <button onClick={() => { setShowTagModal(false); setSelectionBox(null); }} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all text-gray-400">放弃取消</button>
                    <button onClick={submitManualTag} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/20">确认保存标记</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .cursor-dismiss { cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' style='fill:none;stroke:%233b82f6;stroke-width:2.5;' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' /><path d='M15 9l-6 6M9 9l6 6'/></svg>") 16 16, pointer; }
        .cursor-tag { cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' style='fill:none;stroke:%23818cf8;stroke-width:2.5;' viewBox='0 0 24 24'><rect x='3' y='3' width='18' height='18' rx='2' /><path d='M9 9l6 6M15 9l-6 6'/></svg>") 16 16, crosshair; }
        .cursor-split { cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' style='fill:none;stroke:%23f59e0b;stroke-width:2.5;' viewBox='0 0 24 24'><path d='M6 6l12 12m0-12L6 18'/></svg>") 16 16, crosshair; }
      `}} />
    </div>
  );
};

export default VideoAnalysis;