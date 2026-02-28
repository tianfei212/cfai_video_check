
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const KeyframeAnalysis: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 顶部导航与专业操作 */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-5">
          <button onClick={() => navigate(-1)} className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm group">
            <svg className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">{t("关键帧采样序列分析")}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="px-2 py-0.5 bg-black text-white text-[8px] font-bold rounded uppercase tracking-widest">PRO-ANALYST</span>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t("项目编号")}: CAFAI-{id || '1024'} · {t("深度采样模式")}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold hover:bg-gray-50 transition-all">{t("导出分析报告 (PDF/XML)")}</button>
          <button 
            onClick={() => navigate(`/analysis/${id}`)}
            className="px-8 py-3 bg-black text-white rounded-2xl text-xs font-bold shadow-xl shadow-black/10 hover:scale-[1.02] transition-all"
          >
            {t("确认并进入审核")}
          </button>
        </div>
      </div>

      {/* 专业审片列表容器 */}
      <div className="apple-card bg-white border-gray-100 flex flex-col h-[75vh] overflow-hidden shadow-2xl shadow-black/[0.02]">
        {/* 标题头 - 针对多图布局优化 */}
        <div className="grid grid-cols-[1.5fr_1.2fr_2.5fr_1.2fr] px-10 py-5 bg-gray-50/50 border-b border-gray-50 shrink-0">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{t("时间轴索引")}</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-center">{t("开始帧 (START)")}</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-center">{t("AI 核心采样 (KEYFRAME)")}</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right pr-4">{t("结束帧 (END)")}</span>
        </div>

        {/* 滚动内容区 */}
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar space-y-3">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="grid grid-cols-[1.5fr_1.2fr_2.5fr_1.2fr] items-center px-6 py-8 rounded-3xl hover:bg-gray-50 transition-all group cursor-default border border-transparent hover:border-gray-100">
              
              {/* 第一列：时间码与进度感 */}
              <div className="space-y-2">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                    <span className="text-lg font-mono font-bold text-[#1D1D1F]">
                       00:{i < 5 ? '0' + (i * 2) : (i * 2)}:15:04
                    </span>
                 </div>
                 <div className="h-1 w-24 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-200" style={{ width: `${(i+1) * 6}%` }}></div>
                 </div>
              </div>
              
              {/* 第二列：开始帧图像 */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-32 aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-100 shadow-sm opacity-60 group-hover:opacity-100 transition-opacity">
                  <img src={`https://picsum.photos/seed/${i + 500}/160/90`} className="w-full h-full object-cover" alt="start" />
                  <div className="absolute bottom-1 left-2 text-[8px] font-mono font-bold text-white drop-shadow-md">F-{3240 + i * 240}</div>
                </div>
              </div>

              {/* 第三列：AI 核心关键帧 (大图) */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-64 aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-md border-2 border-white group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-500">
                  <img 
                    src={`https://picsum.photos/seed/${i + 200}/320/180`} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    alt="keyframe" 
                  />
                  {/* AI 标记叠加 */}
                  <div className="absolute top-3 left-3 px-2 py-1 bg-blue-500/80 backdrop-blur-md rounded-lg text-[8px] text-white font-bold uppercase tracking-widest">
                    Confidence 99%
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <span className="text-[10px] font-mono font-bold text-gray-400 group-hover:text-black transition-colors">
                  INDEX FRAME: {3240 + i * 240 + 120}
                </span>
              </div>

              {/* 第四列：结束帧图像 */}
              <div className="flex flex-col items-end gap-3 pr-4">
                <div className="relative w-32 aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-100 shadow-sm opacity-60 group-hover:opacity-100 transition-opacity">
                  <img src={`https://picsum.photos/seed/${i + 800}/160/90`} className="w-full h-full object-cover" alt="end" />
                  <div className="absolute bottom-1 right-2 text-[8px] font-mono font-bold text-white drop-shadow-md">F-{3240 + i * 240 + 239}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部专业指标摘要 */}
        <div className="px-10 py-6 bg-gray-900 text-white flex justify-between items-center shrink-0">
          <div className="flex gap-12">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">{t("采样密度")}</span>
              <span className="text-base font-bold tracking-tight">2.4 Keyframes / Sec</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">{t("色彩空间一致性")}</span>
              <span className="text-base font-bold tracking-tight text-green-400">PASSED</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">{t("总计提取")}</span>
              <span className="text-base font-bold tracking-tight">12.4 GB {t("序列数据")}</span>
            </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">{t("检测集群状态")}</p>
             <div className="flex items-center justify-end gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-bold font-mono">NODE-04 ACTIVE</span>
             </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
          border: 2px solid white;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
        }
      `}} />
    </div>
  );
};

export default KeyframeAnalysis;
