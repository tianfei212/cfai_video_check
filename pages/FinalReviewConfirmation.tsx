
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const FinalReviewConfirmation: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [signature, setSignature] = useState('');
  const [opinion, setOpinion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFinalSubmit = () => {
    if (!signature.trim()) {
      alert('请专家进行电子签名后再提交。');
      return;
    }
    
    setIsSubmitting(true);
    
    // 模拟云端存证与提交流程 (更快的响应，模拟点击即关闭的流畅感)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // 成功状态展示 0.8 秒后，立即返回系统索引页面 (影片列表 /list)
      setTimeout(() => {
        navigate('/list');
      }, 800);
    }, 800);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0B] flex flex-col items-center justify-center text-white z-[100] animate-in fade-in zoom-out duration-700">
         <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(34,197,94,0.4)] relative scale-110">
            <svg className="w-12 h-12 text-white animate-in zoom-in duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
            </svg>
         </div>
         <h1 className="text-3xl font-bold tracking-tight mb-2 text-center">签发成功</h1>
         <p className="text-gray-500 text-sm text-center font-medium">任务已归档，正在返回系统索引...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0A0A0B] text-white flex flex-col font-sans overflow-hidden select-none animate-in fade-in duration-500">
      {/* 极简页头 */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-10 bg-black/40 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
           </button>
           <h1 className="text-lg font-bold tracking-tight">终审签发确认中心</h1>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic leading-none">CAFAI Film Analysis Report</span>
           <span className="text-[8px] text-gray-600 mt-1 uppercase tracking-tighter">Serial No: CAFAI-S-{id?.toUpperCase()}</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar p-10 flex flex-col items-center">
        <div className="w-full max-w-5xl space-y-12 animate-in slide-in-from-bottom-6 duration-700">
           {/* 标题区 */}
           <div className="text-center">
              <h2 className="text-5xl font-black tracking-tighter mb-4 text-white/95 text-balance">审核报告核验就绪</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">您即将对影片进行专家级最终审定。签发后，该版本的合规序列将作为唯一官方存证结果同步至云端。</p>
           </div>

           {/* 统计看板 */}
           <div className="grid grid-cols-3 gap-6">
              <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 group-hover:text-blue-400">AI 辅助发现</p>
                 <h4 className="text-4xl font-bold tracking-tighter">142 <span className="text-sm font-medium text-gray-500 ml-1">项标记</span></h4>
                 <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-green-500/80">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                    全量特征比对完成
                 </div>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 group-hover:text-indigo-400">人工标注补充</p>
                 <h4 className="text-4xl font-bold tracking-tighter">12 <span className="text-sm font-medium text-gray-500 ml-1">项标记</span></h4>
                 <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-indigo-400/80">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                    专家校验通过
                 </div>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-indigo-600/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-all group">
                 <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">综合合规建议</p>
                 <h4 className="text-4xl font-bold tracking-tighter text-indigo-100 italic underline decoration-indigo-500/30">建议准予</h4>
                 <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    风险等级: LOW RISK
                 </div>
              </div>
           </div>

           {/* 电子签名与评审结论区 */}
           <div className="bg-[#1D1D1F] rounded-[3.5rem] p-12 border border-white/10 shadow-3xl">
              <div className="flex flex-col lg:flex-row gap-12">
                 {/* 左侧：多行评审结论 */}
                 <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                       <h5 className="text-xl font-bold tracking-tight">专家评审结论与意见</h5>
                       <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Expert Conclusion</span>
                    </div>
                    <textarea 
                       value={opinion}
                       onChange={(e) => setOpinion(e.target.value)}
                       placeholder="在此处输入详细的专家终审意见、备注或签发合规声明..."
                       className="w-full h-48 bg-black/40 border border-white/5 rounded-3xl p-6 text-[13px] text-gray-300 leading-relaxed font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none resize-none custom-scrollbar shadow-inner"
                    />
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                          <p className="text-[9px] font-bold text-gray-600 uppercase mb-1">审核流水号 / ID</p>
                          <p className="text-xs font-bold font-mono text-gray-400">CAFAI-REF-20240203-09</p>
                       </div>
                       <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                          <p className="text-[9px] font-bold text-gray-600 uppercase mb-1">系统当前时间</p>
                          <p className="text-xs font-bold font-mono text-gray-400">{new Date().toLocaleString()}</p>
                       </div>
                    </div>
                 </div>

                 {/* 右侧：签名输入 */}
                 <div className="w-full lg:w-[360px] flex flex-col justify-between py-1">
                    <div className="space-y-4">
                       <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">在此处输入全名完成签名</label>
                       <div className="relative group">
                          <input 
                             type="text" 
                             value={signature}
                             onChange={(e) => setSignature(e.target.value)}
                             placeholder="请输入审核专家姓名"
                             className="w-full h-24 bg-black rounded-[2rem] border border-white/10 text-center text-3xl font-bold italic tracking-wider focus:border-indigo-500 focus:bg-black/80 transition-all outline-none shadow-2xl group-hover:border-white/20"
                          />
                          <div className="absolute inset-0 rounded-[2rem] border border-indigo-500/0 group-focus-within:border-indigo-500/40 pointer-events-none transition-all duration-700"></div>
                       </div>
                       <p className="text-[9px] text-center text-gray-600 font-bold uppercase tracking-widest mt-4">
                          <span className="opacity-50">Identity Verified via</span> CAFAI-AUTH-SECURE
                       </p>
                    </div>

                    <div className="mt-8 p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-3">
                       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
                          <span className="text-gray-500">签发人 ID</span>
                          <span className="text-indigo-400">EXPERT-ZH-202401</span>
                       </div>
                       <div className="w-full h-px bg-white/5"></div>
                       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
                          <span className="text-gray-500">认证等级</span>
                          <span className="text-green-500">LEVEL 5 EXPERT</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* 操作区 */}
           <div className="flex flex-col items-center gap-6 pb-20">
              {isSubmitting ? (
                <div className="flex flex-col items-center gap-4">
                   <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                   <p className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em]">正在同步合规序列并签名归档...</p>
                </div>
              ) : (
                <>
                  <button 
                    onClick={handleFinalSubmit}
                    className="group relative px-24 py-6 bg-white text-black rounded-3xl text-lg font-bold shadow-2xl hover:scale-[1.03] active:scale-95 transition-all overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10 group-hover:text-white transition-colors duration-500 italic">确认签发并归档报告</span>
                  </button>
                  <button 
                    onClick={() => navigate('/list')} 
                    className="text-sm font-bold text-gray-500 hover:text-white transition-colors tracking-tight"
                  >
                    放弃审核并直接关闭页面
                  </button>
                </>
              )}
           </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
      `}} />
    </div>
  );
};

export default FinalReviewConfirmation;
