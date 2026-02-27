
import React, { useState, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const PRESET_THEMES = ['国旗', '军徽', '敏感标志', '违禁文字', '暴力场面', '构图美学'];

interface SegmentConfig {
  filmType: string;
  confidence: number;
  fps: number;
  blackFrames: number;
}

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const [themes, setThemes] = useState<string[]>(['国旗', '敏感标志']);
  const [customInput, setCustomInput] = useState('');
  
  // 自动化流程状态
  const [autoSegment, setAutoSegment] = useState(false);
  const [autoDetect, setAutoDetect] = useState(false);

  // 自动切分配置状态
  const [showSegmentModal, setShowSegmentModal] = useState(false);
  const [segmentConfig, setSegmentConfig] = useState<SegmentConfig>({
    filmType: '电影长片',
    confidence: 85,
    fps: 24,
    blackFrames: 3
  });

  const toggleTheme = (tag: string) => {
    setThemes(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTheme = () => {
    const trimmed = customInput.trim();
    if (trimmed && !themes.includes(trimmed)) {
      setThemes(prev => [...prev, trimmed]);
      setCustomInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTheme();
    }
  };

  const handleSegmentButtonClick = () => {
    if (!autoSegment) {
      setShowSegmentModal(true);
    } else {
      setAutoSegment(false);
    }
  };

  const saveSegmentConfig = () => {
    setAutoSegment(true);
    setShowSegmentModal(false);
  };

  const handleCreate = () => {
    navigate('/import');
  };

  return (
    <div className="max-w-3xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-12 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-[#1D1D1F]">新建审核工程</h1>
        <p className="text-gray-400">配置导入策略与 AI 检测主题，启动自动化合规线程</p>
      </div>

      <div className="space-y-8">
        {/* 导入策略 */}
        <section className="apple-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">导入策略 (OSS 预处理)</h3>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-500 text-[10px] font-bold rounded-md border border-blue-100 uppercase tracking-tighter">当前推荐</span>
          </div>
          
          <div className="relative group">
            <div className="p-8 rounded-3xl border-2 border-black bg-gray-50/50 flex items-start gap-6 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-black text-white shadow-xl shadow-black/20 flex items-center justify-center shrink-0">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-[#1D1D1F] mb-1">直接视频流导入</h4>
                <p className="text-sm text-gray-400 leading-relaxed max-w-md">适用于完整成片或粗剪素材。系统将自动进行 OSS 分片预处理，支持实时切片分析与并行推理计算。</p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">在线就绪</span>
              </div>
            </div>
          </div>
        </section>

        {/* 检测主题与自动化流程 */}
        <section className="apple-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">AI 检测主题配置</h3>
            <div className="flex items-center gap-2">
               <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">已选检测项: {themes.length}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {Array.from(new Set([...PRESET_THEMES, ...themes])).map(tag => (
              <button 
                key={tag}
                onClick={() => toggleTheme(tag)}
                className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all border-2 flex items-center gap-2 group ${
                  themes.includes(tag) 
                    ? 'bg-black text-white border-black shadow-lg shadow-black/10' 
                    : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
                }`}
              >
                {tag}
                {themes.includes(tag) && !PRESET_THEMES.includes(tag) && (
                  <span className="opacity-40 group-hover:opacity-100">✕</span>
                )}
              </button>
            ))}

            <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-100 p-1 focus-within:ring-2 focus-within:ring-black/5 transition-all">
               <input 
                 type="text" 
                 value={customInput}
                 onChange={(e) => setCustomInput(e.target.value)}
                 onKeyDown={handleKeyDown}
                 placeholder="输入自定义检测关键词..." 
                 className="bg-transparent border-none text-xs px-4 py-2 w-48 focus:ring-0 placeholder:text-gray-300"
               />
               <button 
                 onClick={handleAddCustomTheme}
                 className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-100 transition-colors"
               >
                 <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
               </button>
            </div>
          </div>

          {/* 自动化流程步序区 */}
          <div className="mb-8">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-4">自动化流程步序 (AUTOMATION WORKFLOW)</p>
            <div className="grid grid-cols-3 gap-4">
              {/* 步序 1: 视频导入 */}
              <div className="relative group cursor-not-allowed">
                <div className="flex items-center justify-center h-14 rounded-2xl bg-black text-white shadow-lg border-2 border-black">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                  <span className="text-xs font-bold italic">视频导入</span>
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                </div>
              </div>

              {/* 步序 2: 自动切分视频 (带配置弹窗) */}
              <button 
                onClick={handleSegmentButtonClick}
                className={`relative flex items-center justify-center h-14 rounded-2xl transition-all duration-300 border-2 ${
                  autoSegment 
                    ? 'bg-black border-black text-white shadow-lg' 
                    : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-white hover:border-gray-200'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758L5 19m0-14l4.121 4.121"/></svg>
                <div className="flex flex-col items-start">
                   <span className="text-xs font-bold italic">自动切分视频</span>
                   {autoSegment && <span className="text-[7px] opacity-60 uppercase font-mono tracking-tighter">{segmentConfig.filmType} @ {segmentConfig.fps}fps</span>}
                </div>
                {autoSegment && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-in zoom-in duration-300">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                  </div>
                )}
              </button>

              {/* 步序 3: 自动主体检测 */}
              <button 
                onClick={() => setAutoDetect(!autoDetect)}
                className={`relative flex items-center justify-center h-14 rounded-2xl transition-all duration-300 border-2 ${
                  autoDetect 
                    ? 'bg-black border-black text-white shadow-lg' 
                    : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-white hover:border-gray-200'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                <span className="text-xs font-bold italic">自动主体检测</span>
                {autoDetect && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-in zoom-in duration-300">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
             <div className="flex items-center gap-3 mb-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">核心原则 (CORE PRINCIPLE)</span>
             </div>
             <p className="text-[11px] text-gray-400 leading-relaxed italic">
                {autoSegment && autoDetect 
                  ? "当前已开启完整自动化流程：导入视频后系统将立即启动云端切片，并基于所选主题进入自动检测环节。" 
                  : "导入视频后，系统仅完成基础预处理。如需全自动检测，请在上方勾选相应的自动化流程步序。"}
             </p>
          </div>
        </section>

        {/* 底部操作 */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
          <button 
            onClick={() => navigate('/list')}
            className="px-8 py-4 text-sm font-bold text-gray-400 hover:text-black transition-colors"
          >
            放弃并返回工作台
          </button>
          <button 
            onClick={handleCreate}
            className="px-12 py-4 bg-black text-white rounded-2xl text-sm font-bold shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
          >
            <span>进入视频导入环节</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </button>
        </div>
      </div>

      {/* 自动切分配置模态框 */}
      {showSegmentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-500">
              <div className="p-10 pb-6 border-b border-gray-50">
                 <h2 className="text-2xl font-bold tracking-tight mb-2">自动切分引擎配置</h2>
                 <p className="text-xs text-gray-400 font-medium">配置 AI 视觉推理模型的切点检测参数，以优化转场识别准确度。</p>
              </div>

              <div className="p-10 space-y-8">
                 {/* 影片类型 */}
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">影片艺术类型 (FILM GENRE)</label>
                    <div className="grid grid-cols-2 gap-3">
                       {['电影长片', '广告/预告片', '纪录片', '综艺节目'].map(type => (
                         <button 
                            key={type}
                            onClick={() => setSegmentConfig({ ...segmentConfig, filmType: type })}
                            className={`px-6 py-4 rounded-2xl text-xs font-bold border-2 transition-all ${segmentConfig.filmType === type ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'}`}
                         >
                            {type}
                         </button>
                       ))}
                    </div>
                 </div>

                 {/* 置信度 */}
                 <div className="space-y-3">
                    <div className="flex justify-between items-end ml-1">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">推理置信度阈值 (AI CONFIDENCE)</label>
                       <span className="text-sm font-mono font-bold text-black">{segmentConfig.confidence}%</span>
                    </div>
                    <div className="relative pt-2">
                       <input 
                         type="range" 
                         min="0" 
                         max="100" 
                         value={segmentConfig.confidence}
                         onChange={(e) => setSegmentConfig({ ...segmentConfig, confidence: parseInt(e.target.value) })}
                         className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black" 
                       />
                       <div className="flex justify-between text-[8px] text-gray-300 font-bold uppercase mt-2 px-1">
                          <span>敏感模式</span>
                          <span>标准模式</span>
                          <span>严格模式</span>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    {/* 影片帧率 */}
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">影片输出帧率 (FPS)</label>
                       <select 
                         value={segmentConfig.fps}
                         onChange={(e) => setSegmentConfig({ ...segmentConfig, fps: parseFloat(e.target.value) })}
                         className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-black/5 transition-all outline-none"
                       >
                          <option value={23.976}>23.976 fps</option>
                          <option value={24}>24.00 fps</option>
                          <option value={25}>25.00 fps</option>
                          <option value={30}>30.00 fps</option>
                          <option value={60}>60.00 fps</option>
                       </select>
                    </div>
                    {/* 黑场帧数 */}
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">黑场判定帧数 (BLACK THRESHOLD)</label>
                       <div className="flex items-center bg-gray-50 rounded-2xl border border-transparent focus-within:ring-4 focus-within:ring-black/5 transition-all">
                          <input 
                             type="number" 
                             min="1" 
                             max="15" 
                             value={segmentConfig.blackFrames}
                             onChange={(e) => setSegmentConfig({ ...segmentConfig, blackFrames: parseInt(e.target.value) })}
                             className="bg-transparent border-none text-sm font-bold flex-1 px-5 py-4 focus:ring-0" 
                          />
                          <span className="pr-5 text-[10px] font-bold text-gray-300">FRAMES</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-10 pt-4 flex gap-4">
                 <button 
                   onClick={() => setShowSegmentModal(false)}
                   className="flex-1 py-5 rounded-2xl bg-gray-50 text-gray-400 text-sm font-bold hover:bg-gray-100 transition-all"
                 >
                    取消并关闭
                 </button>
                 <button 
                   onClick={saveSegmentConfig}
                   className="flex-1 py-5 rounded-2xl bg-black text-white text-sm font-bold shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all"
                 >
                    保存并应用配置
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CreateProject;
