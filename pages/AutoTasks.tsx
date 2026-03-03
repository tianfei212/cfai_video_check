
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface TaskProgress {
  import: number;
  segment: number;
  audit: number;
}

type AutoPipelineOptions = {
  segment?: boolean;
  audit?: boolean;
};

const AutoTasks: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isFromProject = location.state?.fromProject;
  const projectName = location.state?.projectName || '未命名工程_20231124';
  const autoOptions = location.state?.autoOptions as AutoPipelineOptions | undefined;
  const enableSegment = autoOptions?.segment ?? true;
  const enableAudit = autoOptions?.audit ?? !isFromProject;

  // 初始进度
  const [progress, setProgress] = useState<TaskProgress>({ import: 0, segment: 0, audit: 0 });
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // 模拟演示加速
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = { ...prev };
        
        // 第一阶段：导入/预处理
        if (next.import < 100) {
          next.import = Math.min(100, next.import + Math.random() * 10 + 5);
        }
        // 第二阶段：自动切分
        else if (enableSegment && next.segment < 100) {
          next.segment = Math.min(100, next.segment + Math.random() * 8 + 4);
        }
        // 第三阶段：自动内容审核
        else if (enableAudit && next.audit < 100) {
          next.audit = Math.min(100, next.audit + Math.random() * 6 + 3);
        }

        const segmentDone = enableSegment ? next.segment === 100 : true;
        const auditDone = enableAudit ? next.audit === 100 : true;
        if (next.import === 100 && segmentDone && auditDone) {
          setIsFinished(true);
          clearInterval(timer);
        }
        
        return next;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [enableAudit, enableSegment]);

  const ProgressBar: React.FC<{ value: number; active: boolean; label?: string }> = ({ value, active, label }) => (
    <div className="flex flex-col gap-2 w-full min-w-[140px] max-w-[200px]">
      <div className="flex justify-between items-center text-[10px] font-bold">
        <div className="flex items-center gap-2">
          <span className={active ? 'text-black' : 'text-gray-300'}>{Math.round(value)}%</span>
          {label && <span className="text-[8px] text-gray-300 font-bold uppercase tracking-tighter">({label})</span>}
        </div>
        {value === 100 && (
          <div className="flex items-center gap-1 text-green-500">
            <span className="text-[8px] font-bold uppercase tracking-tighter">Ready</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
          </div>
        )}
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden p-[2px]">
        <div 
          className={`h-full transition-all duration-700 ease-out rounded-full ${
            active 
              ? (value === 100 ? 'bg-green-500' : 'bg-black shadow-[0_0_8px_rgba(0,0,0,0.1)]') 
              : 'bg-gray-100'
          }`} 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-10 animate-in fade-in duration-700">
      <div className="mb-12 flex justify-between items-end px-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-[#1D1D1F]">{t("自动化任务监测")}</h1>
          <p className="text-gray-400">{t("正在实时监控云端 GPU 推理集群的合规性审核流水线")}</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl">
           <div className={`w-2 h-2 rounded-full ${isFinished ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`}></div>
           <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
             {isFinished ? t('已就绪 (READY)') : t('后台处理中 (PROCESSING)')}
           </span>
        </div>
      </div>

      {/* 滚动容器 */}
      <div className="apple-card overflow-hidden shadow-2xl shadow-black/[0.02]">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/30">
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("影片项目项")}</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("当前版本")}</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("导入预处理")}</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("自动切分 (约 2H)")}</th>
                <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("内容自检 (约 5H)")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="hover:bg-gray-50/20 transition-colors group">
                <td className="px-8 py-10">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden shadow-sm border border-white group-hover:scale-105 transition-transform duration-500">
                      <img src="https://picsum.photos/seed/current/150/150" alt="thumb" className="w-full h-full object-cover" />
                    </div>
                    <div className="max-w-[180px]">
                      <span className="font-bold text-base text-[#1D1D1F] block mb-1 truncate">{projectName}</span>
                      <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">PID: CAFAI-9821-X</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-10">
                  {isFromProject ? (
                    <input 
                      type="text" 
                      defaultValue="v1.3.0_NEW"
                      className="px-4 py-1.5 bg-white border border-gray-200 text-[10px] font-bold rounded-xl text-black uppercase font-mono tracking-tighter outline-none focus:ring-2 focus:ring-black/5 w-32 shadow-sm"
                    />
                  ) : (
                    <span className="px-4 py-1.5 bg-gray-50 border border-gray-100 text-[10px] font-bold rounded-xl text-gray-400 uppercase font-mono tracking-tighter">
                      v1.0.0_BASE
                    </span>
                  )}
                </td>
                <td className="px-8 py-10">
                  <ProgressBar value={progress.import} active={progress.import > 0} />
                </td>
                <td className="px-8 py-10">
                  <ProgressBar value={progress.segment} active={enableSegment && progress.import === 100} label={enableSegment ? "EST: 120M" : "DISABLED"} />
                </td>
                <td className="px-8 py-10">
                  <ProgressBar
                    value={progress.audit}
                    active={enableAudit && (enableSegment ? progress.segment === 100 : progress.import === 100)}
                    label={enableAudit ? "EST: 300M" : "DISABLED"}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 底部引导区 */}
      <div className="mt-16 flex flex-col items-center">
        <div className={`mb-10 p-8 rounded-[2rem] border transition-all duration-700 max-w-2xl text-center flex flex-col items-center gap-4 ${
          isFinished ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'
        }`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${isFinished ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
             {isFinished 
               ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
               : <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
             }
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
            {isFinished 
              ? t("任务流处理已就绪。请点击下方按钮进入信息核验环节。")
              : t("系统正在云端执行自动化任务。您也可以保持页面开启以实时查看进度。")}
          </p>
        </div>

        <div className="flex gap-6">
          <button 
            onClick={() => navigate('/list')}
            className="px-10 py-4 text-sm font-bold text-gray-400 hover:text-black transition-colors"
          >
            {t("返回工作台")}
          </button>
          <button 
            disabled={!isFinished}
            onClick={() => navigate('/import?step=2', { state: location.state })}
            className={`px-16 py-5 rounded-2xl text-sm font-bold flex items-center gap-3 transition-all ${
              isFinished 
                ? 'bg-black text-white shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-200'
            }`}
          >
            <span>{isFinished ? t('进入信息核验环节') : t('自动任务处理中...')}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
        }
      `}} />
    </div>
  );
};

export default AutoTasks;
