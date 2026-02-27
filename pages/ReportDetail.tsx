
import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

interface ReportItem {
  timecode: string;
  frame: string;
  baseThumb: string;
  compThumb: string;
  description: string;
}

const MOCK_REPORT_ITEMS: ReportItem[] = [
  { timecode: '00:00:15:04', frame: 'F364', baseThumb: 'https://picsum.photos/seed/report1/160/90', compThumb: 'https://picsum.photos/seed/report2/160/90', description: '像素级位移，检测到边缘抖动' },
  { timecode: '00:00:35:12', frame: 'F840', baseThumb: 'https://picsum.photos/seed/report3/160/90', compThumb: 'https://picsum.photos/seed/report4/160/90', description: '新增背景品牌 Logo，存在侵权风险' },
  { timecode: '00:00:42:01', frame: 'F1008', baseThumb: 'https://picsum.photos/seed/report5/160/90', compThumb: 'https://picsum.photos/seed/report6/160/90', description: '色彩断层，8bit 压缩导致色阶不连续' },
  { timecode: '00:01:12:18', frame: 'F1728', baseThumb: 'https://picsum.photos/seed/report7/160/90', compThumb: 'https://picsum.photos/seed/report8/160/90', description: '高频纹理区域出现 AI 插帧导致的动态伪影' },
  { timecode: '00:02:05:09', frame: 'F3000', baseThumb: 'https://picsum.photos/seed/report9/160/90', compThumb: 'https://picsum.photos/seed/report10/160/90', description: '特效渲染层漏失：背景远景建筑未正常渲染' },
];

const ReportDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { versionName = 'v1.2 (终审版)' } = location.state || {};

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col animate-in fade-in duration-700">
      {/* 顶部导航栏 */}
      <header className="h-20 apple-blur border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-[100]">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#1D1D1F]">AI 辅助审片分析详细报告</h1>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-0.5">Report ID: CAFAI-AR-{id?.toUpperCase()}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
              {['PDF', 'WORD', 'MD'].map(format => (
                <button key={format} className="px-5 py-2 hover:bg-gray-50 text-[10px] font-bold rounded-xl transition-all uppercase tracking-widest border border-transparent hover:border-gray-100">下载 {format}</button>
              ))}
           </div>
           <button onClick={() => navigate(-1)} className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm text-gray-400 hover:text-black">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
           </button>
        </div>
      </header>

      {/* 主体内容区 */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-10 space-y-10">
        {/* 概览信息卡片 */}
        <section className="grid grid-cols-4 gap-6">
           <div className="apple-card p-8 border-none shadow-sm bg-white/60">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">对比版本序列</p>
              <p className="text-sm font-bold text-[#1D1D1F]">v1.0 (Base) <span className="mx-2 text-gray-300">vs</span> {versionName}</p>
           </div>
           <div className="apple-card p-8 border-none shadow-sm bg-white/60">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">报告生成时间</p>
              <p className="text-sm font-bold text-[#1D1D1F] font-mono">2023-11-25 14:20</p>
           </div>
           <div className="apple-card p-8 border-none shadow-sm bg-white/60">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">执行操作专家</p>
              <p className="text-sm font-bold text-[#1D1D1F]">李华 (高级审核员)</p>
           </div>
           <div className="apple-card p-8 border-none shadow-sm bg-blue-50/50">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">最终评审结论</p>
              <p className="text-sm font-bold text-blue-600">准予发布 (PASSED)</p>
           </div>
        </section>

        {/* 差异分析数据表 */}
        <section className="apple-card overflow-hidden border-none shadow-2xl shadow-black/[0.02] bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">时间轴 (TC)</th>
                <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">采样帧数</th>
                <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Base 视频不同点位置</th>
                <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">对比视频不同点位置</th>
                <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">差异化详细说明</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_REPORT_ITEMS.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-10 py-8">
                    <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50/50 px-3 py-1.5 rounded-lg">{item.timecode}</span>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-xs font-mono font-medium text-gray-400">{item.frame}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="relative w-40 aspect-video rounded-2xl overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-md transition-all">
                      <img src={item.baseThumb} className="w-full h-full object-cover" alt="base" />
                      <div className="absolute inset-0 bg-black/5" />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/40 backdrop-blur-md rounded text-[7px] text-white font-bold uppercase tracking-tighter">BASE</div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="relative w-40 aspect-video rounded-2xl overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-md transition-all">
                      <img src={item.compThumb} className="w-full h-full object-cover" alt="comp" />
                      <div className="absolute inset-0 bg-black/5" />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-indigo-500/80 backdrop-blur-md rounded text-[7px] text-white font-bold uppercase tracking-tighter">COMP</div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-xs font-medium text-gray-500 leading-relaxed italic pr-4">“{item.description}”</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 底部印章与版权 */}
        <div className="pt-20 pb-10 flex justify-between items-end opacity-40">
           <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">中国电影人工智能研究院报告生成中心</p>
              <p className="text-[8px] font-mono text-gray-300">CAF-AI REPORT AUTHENTICATION · SYSTEM V2.5</p>
           </div>
           <div className="w-32 h-32 border-[6px] border-gray-100 rounded-full flex flex-col items-center justify-center text-[10px] font-black text-gray-200 uppercase tracking-tighter rotate-12 select-none">
              <span className="mb-1">Verified</span>
              <div className="w-full h-px bg-gray-100 my-1" />
              <span>CAFAI STAMP</span>
           </div>
        </div>
      </main>

      {/* 底部悬浮操作 */}
      <footer className="p-8 flex justify-center sticky bottom-0 z-[100] pointer-events-none">
         <button 
           onClick={() => navigate(-1)} 
           className="pointer-events-auto px-16 py-5 bg-black text-white rounded-[2rem] text-sm font-bold shadow-3xl hover:scale-[1.05] active:scale-95 transition-all"
         >
           关闭报告并返回工程详情
         </button>
      </footer>
    </div>
  );
};

export default ReportDetail;
