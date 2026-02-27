
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const VideoImport: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isFromProject = location.state?.fromProject;
  const projectNameFromState = location.state?.projectName;
  
  // 根据 URL 参数初始化步骤，如果是从任务页返回，则直接进入 Step 2
  const queryParams = new URLSearchParams(location.search);
  const initialStep = queryParams.get('step') === '2' ? 2 : 1;

  const [step, setStep] = useState(initialStep);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const circumference = 364.4;

  useEffect(() => {
    if (initialStep === 2) {
      setStep(2);
    }
  }, [initialStep]);

  const handleStartUpload = () => {
    setIsUploading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          // 上传完成，进入自动化任务监测页面，并透传 state
          navigate('/auto-tasks', { state: location.state });
        }, 800);
      }
      setProgress(p);
    }, 400);
  };

  const handleFinish = () => {
    navigate('/list'); // 最终完成后返回列表
  };

  return (
    <div className="max-w-7xl mx-auto py-6 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={() => navigate('/create')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">导入原始影片</h1>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">
            Step {step} of 3: {step === 1 ? '文件上传' : step === 2 ? '信息核验' : '启动检测'}
          </p>
        </div>
      </div>

      {/* 进度指示条 */}
      <div className="flex gap-4 mb-12 px-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${s <= step ? 'bg-black shadow-[0_0_8px_rgba(0,0,0,0.1)]' : 'bg-gray-100'}`}></div>
        ))}
      </div>

      <div className="min-h-[400px]">
        {step === 1 && (
          <div className="apple-card p-16 flex flex-col items-center justify-center border-dashed border-2 border-gray-100 bg-white/50 mx-2">
            {!isUploading ? (
              <div className="text-center max-w-sm">
                <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-3">拖拽视频文件至此</h3>
                <p className="text-sm text-gray-400 mb-10 leading-relaxed">支持 MP4, MOV, MKV 格式。文件将自动上传至研究院 OSS 节点并进行帧预处理。</p>
                <button 
                  onClick={handleStartUpload}
                  className="px-12 py-4 bg-black text-white rounded-2xl text-sm font-bold shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  选择本地文件
                </button>
                <div className="mt-12 pt-10 border-t border-gray-50 w-full">
                   <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-5">或者通过内网路径导入</p>
                   <div className="flex bg-gray-50 rounded-2xl p-1.5 border border-gray-100 focus-within:bg-white focus-within:ring-4 focus-within:ring-black/5 transition-all">
                      <input type="text" placeholder="oss://bucket-01/assets/films/..." className="bg-transparent border-none text-xs flex-1 px-4 focus:ring-0 placeholder:text-gray-300" />
                      <button className="px-6 py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-bold shadow-sm hover:bg-gray-50 transition-all uppercase tracking-tighter">解析路径</button>
                   </div>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-sm text-center">
                <div className="relative w-40 h-40 mx-auto mb-10">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-50" />
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="6" fill="transparent" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference - (circumference * progress) / 100} className="text-black transition-all duration-500 ease-out" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold tracking-tighter">{Math.round(progress)}%</div>
                </div>
                <h3 className="text-xl font-bold mb-2">正在上云预处理...</h3>
                <p className="text-sm text-gray-400 font-medium">正在生成关键帧索引并进行色彩空间标准化</p>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-right-4 duration-700 px-2 space-y-8">
            {/* 顶层信息确认 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className="apple-card p-10">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">基本信息确认</h3>
                <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">影片标题</label>
                    <input 
                      type="text" 
                      defaultValue={projectNameFromState || "未命名工程_20231124"} 
                      disabled={isFromProject}
                      className={`w-full border border-gray-100 rounded-2xl px-5 py-4 text-sm transition-all outline-none font-medium ${isFromProject ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-black/5'}`} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      {isFromProject ? '新增版本号' : '初始版本号'}
                    </label>
                    <input 
                      type="text" 
                      defaultValue={isFromProject ? "v1.3" : "v1.0"} 
                      disabled={!isFromProject}
                      className={`w-full border border-gray-100 rounded-2xl px-5 py-4 text-sm font-mono transition-all outline-none ${isFromProject ? 'bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-black/5' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">制片方</label>
                    <input type="text" placeholder="输入提交单位" className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-black/5 transition-all outline-none font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">影片时长</label>
                    <input type="text" defaultValue="02:14:55" className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-black/5 transition-all outline-none font-mono" />
                  </div>
                </div>
              </section>

              <section className="apple-card p-10 flex flex-col justify-center">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-12">技术指标预览</h3>
                <div className="flex items-center justify-between">
                   <div className="flex flex-col gap-1">
                     <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">分辨率</span>
                     <span className="text-xl font-bold tracking-tight text-[#1D1D1F]">3840 × 2160 (4K)</span>
                   </div>
                   <div className="w-px h-10 bg-gray-100"></div>
                   <div className="flex flex-col gap-1">
                     <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">帧率</span>
                     <span className="text-xl font-bold tracking-tight font-mono text-[#1D1D1F]">24.00 fps</span>
                   </div>
                   <div className="w-px h-10 bg-gray-100"></div>
                   <div className="flex flex-col gap-1">
                     <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">色彩空间</span>
                     <span className="text-xl font-bold tracking-tight text-[#1D1D1F]">Rec.2020 / HDR10</span>
                   </div>
                </div>
              </section>
            </div>

            {/* 底部引导区 - 进入独立关键帧页面 */}
            <div className="apple-card p-12 bg-gray-900 text-white flex items-center justify-between overflow-hidden relative">
               <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
               <div className="relative z-10">
                 <h4 className="text-2xl font-bold tracking-tight mb-2">基础信息确认无误</h4>
                 <p className="text-sm opacity-50 font-medium">下一步将进入“关键帧序列分析”页面，查看 AI 提取的详细片段索引。</p>
               </div>
               <button 
                 onClick={() => navigate('/keyframes/1001')} 
                 className="relative z-10 px-12 py-5 bg-white text-black rounded-2xl text-sm font-bold shadow-2xl hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-3"
               >
                 <span>确认信息并下一步</span>
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
               </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="apple-card p-16 text-center max-w-2xl mx-auto animate-in zoom-in-95 duration-500 px-2">
             <div className="w-24 h-24 bg-green-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 relative">
                <div className="absolute inset-0 rounded-[2.5rem] border-2 border-green-200 animate-ping opacity-20"></div>
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
             </div>
             <h2 className="text-3xl font-bold mb-4 tracking-tight">准备生成审核报告</h2>
             <p className="text-sm text-gray-400 mb-12 leading-relaxed max-w-sm mx-auto">所有自动化处理已完成，信息核验无误。现在您可以生成最终的 AI 辅助审核结果。</p>
             
             <div className="grid grid-cols-2 gap-4 mb-12">
               <button onClick={() => setStep(2)} className="py-4 border border-gray-100 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">返回修改</button>
               <button onClick={handleFinish} className="py-4 bg-black text-white rounded-2xl text-sm font-bold shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all">完成并发布结果</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoImport;
