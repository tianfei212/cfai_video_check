
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ReviewStatus, RiskLevel, FilmRecord } from '../types';

const StatusBadge: React.FC<{ status: ReviewStatus }> = ({ status }) => {
  const { t } = useTranslation();
  const styles: Record<ReviewStatus, string> = {
    [ReviewStatus.PENDING]: 'bg-gray-100 text-gray-400',
    [ReviewStatus.PROCESSING]: 'bg-blue-50 text-blue-600',
    [ReviewStatus.APPROVED]: 'bg-green-50 text-green-600',
    [ReviewStatus.REJECTED]: 'bg-red-50 text-red-600',
    [ReviewStatus.FLAGGED]: 'bg-amber-50 text-amber-600',
  };
  return <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${styles[status]}`}>{t(status)}</span>;
};

const ReviewList: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const MOCK_DATA: FilmRecord[] = [
    { id: '1001', title: t('流浪地球 3 预告片'), thumbnail: 'https://picsum.photos/seed/earth/400/225', duration: '02:45', uploadDate: '2023-11-24', status: ReviewStatus.PROCESSING, riskLevel: RiskLevel.LOW, aiScore: 98, submitter: t('中影集团') },
    { id: '1002', title: t('未命名武侠大片'), thumbnail: 'https://picsum.photos/seed/action/400/225', duration: '120:15', uploadDate: '2023-11-23', status: ReviewStatus.PENDING, riskLevel: RiskLevel.MEDIUM, aiScore: 72, submitter: t('博纳影业') },
    { id: '1003', title: t('深度空间：孤寂'), thumbnail: 'https://picsum.photos/seed/space/400/225', duration: '88:40', uploadDate: '2023-11-23', status: ReviewStatus.FLAGGED, riskLevel: RiskLevel.HIGH, aiScore: 45, submitter: t('独立制片人') },
  ];

  // 模拟正在进行的后台任务
  const ONGOING_TASKS = [
    { id: '1001', title: t('流浪地球 3 预告片'), phase: t('自动切分'), progress: 68, est: '12m' },
    { id: '1002', title: t('未命名武侠大片'), phase: t('上传预处理'), progress: 32, est: '4h' },
  ];

  return (
    <div className="space-y-12">
      {/* 顶部标题与操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">{t('影片项目库')}</h1>
          <p className="text-gray-400 mt-1">{t('管理并分析研究院所有在研影片合规工程')}</p>
        </div>
        <button 
          onClick={() => navigate('/create')}
          className="apple-button px-6 py-4 bg-black text-white shadow-2xl shadow-black/20 flex items-center gap-3 hover:scale-[1.02] transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          <span className="text-sm font-bold">{t('新建影片工程')}</span>
        </button>
      </div>

      {/* 核心卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_DATA.map((film) => (
          <div key={film.id} className="apple-card group overflow-hidden flex flex-col cursor-pointer" onClick={() => navigate(`/project/${film.id}`)}>
            <div className="relative aspect-video overflow-hidden">
              <img src={film.thumbnail} alt={film.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <p className="text-white text-xs font-medium mb-1">{film.submitter} · {film.uploadDate}</p>
                <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold">{t('点击管理版本序列')}</p>
              </div>
              <div className="absolute top-4 left-4">
                 <StatusBadge status={film.status} />
              </div>
              <div className="absolute top-4 right-4 px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[9px] text-white font-bold">
                 {film.duration}
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h5 className="font-bold text-lg leading-tight line-clamp-1">{film.title}</h5>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{t('最高风险')}</span>
                  <span className={`text-sm font-bold ${film.riskLevel === RiskLevel.LOW ? 'text-green-500' : film.riskLevel === RiskLevel.MEDIUM ? 'text-amber-500' : 'text-red-500'}`}>
                    {t(film.riskLevel)} Risk
                  </span>
                </div>
                <div className="text-right flex flex-col">
                  <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{t('迭代版本')}</span>
                  <span className="text-lg font-bold tracking-tighter">3 {t('个')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 自动任务监控板块 (仅在有任务时显示) */}
      {ONGOING_TASKS.length > 0 && (
        <div className="pt-10 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{t('实时流水线监控 (REAL-TIME PIPELINE)')}</h3>
            </div>
            <button 
              onClick={() => navigate('/auto-tasks')}
              className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors flex items-center gap-2"
            >
              <span>{t('查看全部任务集')}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>

          <div className="space-y-4">
            {ONGOING_TASKS.map((task) => (
              <div 
                key={task.id}
                onClick={() => navigate('/auto-tasks')}
                className="apple-card p-5 flex items-center gap-8 cursor-pointer hover:bg-white hover:scale-[1.01] active:scale-[0.99] border-gray-50/50"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                   <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                </div>
                
                <div className="w-64">
                   <p className="text-xs font-bold text-[#1D1D1F] truncate mb-1">{task.title}</p>
                   <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{t('任务项 ID:')} CAFAI-{task.id}</p>
                </div>

                <div className="flex-1 px-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-blue-500 uppercase italic">{task.phase}</span>
                    <span className="text-[10px] font-bold text-gray-900">{task.progress}%</span>
                  </div>
                  <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-black transition-all duration-1000 ease-out"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>

                <div className="w-32 text-center">
                   <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-0.5">{t('剩余估时')}</p>
                   <p className="text-xs font-bold text-[#1D1D1F]">{t('约')} {task.est}</p>
                </div>

                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-black group-hover:text-white transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
