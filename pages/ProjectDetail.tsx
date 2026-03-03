
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ReviewStatus, FilmVersion } from '../types';
import { getProjectDetailVersions } from '../data/projectVersions';

type ActionType = 'segment' | 'compare';

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const MOCK_VERSIONS: FilmVersion[] = getProjectDetailVersions(t);

  const [actionModal, setActionModal] = useState<{ version: FilmVersion; action: ActionType } | null>(null);
  const [progressSegmentByVersion, setProgressSegmentByVersion] = useState<Record<string, number>>({});
  const [progressCompareByVersion, setProgressCompareByVersion] = useState<Record<string, number>>({});
  const intervalRef = useRef<Record<string, Partial<Record<ActionType, number>>>>({});
  const cleanupTimeoutRef = useRef<Record<string, Partial<Record<ActionType, number>>>>({});
  const [lockedSegmentByVersion, setLockedSegmentByVersion] = useState<Record<string, boolean>>({});
  const [lockedCompareByVersion, setLockedCompareByVersion] = useState<Record<string, boolean>>({});

  const getActionCopy = (action: ActionType) => {
    if (action === 'segment') {
      return {
        title: t('视频切分'),
        description: t('将对该版本执行自动镜头/片段切分，用于后续审核与分析。'),
        eta: t('预计 30–90 秒'),
      };
    }
    return {
      title: t('对比检验'),
      description: t('将对该版本执行对比检验，输出差异点与风险提示。'),
      eta: t('预计 60–180 秒'),
    };
  };

  const startProgressSimulation = (versionId: string, action: ActionType) => {
    const runningInterval = intervalRef.current[versionId]?.[action];
    if (typeof runningInterval === 'number') return;

    const existingInterval = intervalRef.current[versionId]?.[action];
    if (typeof existingInterval === 'number') window.clearInterval(existingInterval);
    const existingTimeout = cleanupTimeoutRef.current[versionId]?.[action];
    if (typeof existingTimeout === 'number') window.clearTimeout(existingTimeout);

    if (!intervalRef.current[versionId]) intervalRef.current[versionId] = {};
    if (!cleanupTimeoutRef.current[versionId]) cleanupTimeoutRef.current[versionId] = {};

    if (action === 'segment') {
      setLockedSegmentByVersion((prev) => ({ ...prev, [versionId]: true }));
      setProgressSegmentByVersion((prev) => ({ ...prev, [versionId]: 0 }));
    } else {
      setLockedCompareByVersion((prev) => ({ ...prev, [versionId]: true }));
      setProgressCompareByVersion((prev) => ({ ...prev, [versionId]: 0 }));
    }

    intervalRef.current[versionId][action] = window.setInterval(() => {
      const setProgress = action === 'segment' ? setProgressSegmentByVersion : setProgressCompareByVersion;

      setProgress((prev) => {
        const current = prev[versionId] ?? 0;
        if (current >= 100) return prev;

        const step =
          current < 70 ? 3 + Math.floor(Math.random() * 6) : current < 90 ? 1 + Math.floor(Math.random() * 4) : 1;
        const next = Math.min(100, current + step);

        if (next >= 100) {
          const id = intervalRef.current[versionId]?.[action];
          if (typeof id === 'number') window.clearInterval(id);
          if (intervalRef.current[versionId]) {
            delete intervalRef.current[versionId][action];
            if (Object.keys(intervalRef.current[versionId]).length === 0) delete intervalRef.current[versionId];
          }

          cleanupTimeoutRef.current[versionId][action] = window.setTimeout(() => {
            if (action === 'segment') {
              setLockedSegmentByVersion((p) => ({ ...p, [versionId]: false }));
            } else {
              setLockedCompareByVersion((p) => ({ ...p, [versionId]: false }));
            }

            if (cleanupTimeoutRef.current[versionId]) {
              delete cleanupTimeoutRef.current[versionId][action];
              if (Object.keys(cleanupTimeoutRef.current[versionId]).length === 0) delete cleanupTimeoutRef.current[versionId];
            }
          }, 900);
        }

        return { ...prev, [versionId]: next };
      });
    }, 160);
  };

  useEffect(() => {
    return () => {
      Object.keys(intervalRef.current).forEach((versionId) => {
        const actions = intervalRef.current[versionId];
        if (!actions) return;
        (Object.keys(actions) as ActionType[]).forEach((action) => {
          const id = actions[action];
          if (typeof id === 'number') window.clearInterval(id);
        });
      });
      Object.keys(cleanupTimeoutRef.current).forEach((versionId) => {
        const actions = cleanupTimeoutRef.current[versionId];
        if (!actions) return;
        (Object.keys(actions) as ActionType[]).forEach((action) => {
          const id = actions[action];
          if (typeof id === 'number') window.clearTimeout(id);
        });
      });
    };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-6">
           <button onClick={() => navigate('/list')} className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
           </button>
           <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight">{t("流浪地球 3 预告片")}</h1>
                <span className="px-2 py-1 bg-black text-white text-[10px] font-bold rounded-lg uppercase tracking-widest">Active Project</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">
                 <span>{t("项目编号")}: PJ-{id}</span>
                 <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                 <span>{t("中影集团")}</span>
                 <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                 <span>{t("共")} {MOCK_VERSIONS.length} {t("个版本")}</span>
              </div>
           </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/import', { state: { fromProject: true, projectId: id, projectName: t('流浪地球 3 预告片') } })}
            className="apple-button px-6 py-3 bg-black text-white text-sm font-bold shadow-xl shadow-black/10 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            {t("上传新版本")}
          </button>
          <button
            onClick={() => {
              try {
                localStorage.setItem('i18nextLng', i18n.language);
              } catch {}
              const url = `${window.location.origin}${window.location.pathname}#/matchbox?projectId=${encodeURIComponent(id || '')}`;
              const win = window.open(url, '_blank');
              if (win) win.opener = null;
            }}
            className="apple-button px-6 py-3 bg-white border border-gray-200 text-[#1D1D1F] text-sm font-bold shadow-sm hover:border-black transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 3h7v7m0-7L10 14"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5v14h14v-5"/></svg>
            {t("对比检验")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="px-4 py-2 flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          <div className="flex-1 text-center">{t("版本信息")}</div>
          <div className="w-1/6 text-center">{t("提交时间")}</div>
          {/*下面的两项为新增加的操作入口，为人工发起操作 */}
          <div className="w-1/6 text-center">{t("自动操作确认")}</div>
          <div className="w-1/6 text-center">{t("工作进度")}</div>
          <div className="w-1/6 text-center">{t("审核状态")}</div>
          <div className="w-1/6 text-center">{t("关键帧")}</div>
        </div>

        {MOCK_VERSIONS.map((version, index) => {
          return (
            <div 
              key={version.id} 
              className="apple-card p-6 flex items-center group transition-all duration-500"
            >
              <div className="flex-1 flex items-center justify-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs bg-gray-50 text-gray-400">
                  V{MOCK_VERSIONS.length - index}
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 flex items-center justify-center gap-2">
                    {version.versionName}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{version.notes}</p>
                </div>
              </div>

              <div className="w-1/6 text-center text-sm text-gray-500 font-medium">
                {version.uploadDate}
              </div>
              {/*这里对应的是2个操作按键按键*/}
              <div className="w-1/6 flex flex-wrap items-center justify-center gap-2">
                <button 
              disabled={lockedSegmentByVersion[version.id] === true}
              onClick={() => setActionModal({ version, action: 'segment' })}
              className={`px-4 py-2 bg-white border border-gray-100 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                lockedSegmentByVersion[version.id] === true ? 'opacity-40 cursor-not-allowed' : 'hover:border-black'
              }`}
                >
                  {t("视频切分")}
                </button>
                <button 
              disabled={lockedCompareByVersion[version.id] === true}
              onClick={() => setActionModal({ version, action: 'compare' })}
              className={`px-4 py-2 bg-white border border-gray-100 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                lockedCompareByVersion[version.id] === true ? 'opacity-40 cursor-not-allowed' : 'hover:border-black'
              }`}
                >
                  {t("对比检验")}
                </button>
              </div>
              <div className="w-1/6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-full max-w-[180px] space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('视频切分')}</span>
                        <span className="text-[10px] font-bold text-gray-500">{progressSegmentByVersion[version.id] ?? 0}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-black rounded-full transition-all duration-300"
                          style={{ width: `${progressSegmentByVersion[version.id] ?? 0}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('对比检验')}</span>
                        <span className="text-[10px] font-bold text-gray-500">{progressCompareByVersion[version.id] ?? 0}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1D1D1F] rounded-full transition-all duration-300"
                          style={{ width: `${progressCompareByVersion[version.id] ?? 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-1/6 flex items-center justify-center">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  version.status === ReviewStatus.APPROVED ? 'bg-green-50 text-green-600' : 
                  version.status === ReviewStatus.REJECTED ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {version.status}
                </span>
              </div>

              <div className="w-1/6 flex items-center justify-center">
                
                <button 
                  onClick={() => navigate(`/keyframes/${version.id}`)}
                  className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[11px] font-bold transition-all hover:border-black whitespace-nowrap"
                >
                  {t("关键帧")}
                </button>
              </div> 
            </div>
          );
        })}
      </div>

      {actionModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setActionModal(null)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-10 pb-6 border-b border-gray-50">
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                {t('即将执行')} {getActionCopy(actionModal.action).title}
              </h2>
              <p className="text-xs text-gray-400 font-medium">{getActionCopy(actionModal.action).description}</p>
            </div>

            <div className="p-10 space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  {t('目标版本')}
                </div>
                <div className="text-sm font-bold text-gray-900">{actionModal.version.versionName}</div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  {t('预计等待时间')}
                </div>
                <div className="text-2xl font-bold tracking-tight text-gray-900">{getActionCopy(actionModal.action).eta}</div>
                <div className="text-xs text-gray-400 font-medium mt-2">{t('确认后将自动开始并关闭此窗口。')}</div>
              </div>
            </div>

            <div className="p-10 pt-4 flex gap-4">
              <button
                onClick={() => setActionModal(null)}
                className="flex-1 py-5 rounded-2xl bg-gray-50 text-gray-400 text-sm font-bold hover:bg-gray-100 transition-all"
              >
                {t('取消')}
              </button>
              <button
                onClick={() => {
                  startProgressSimulation(actionModal.version.id, actionModal.action);
                  setActionModal(null);
                }}
                className="flex-1 py-5 rounded-2xl bg-black text-white text-sm font-bold shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                {t('确认并开始')}
              </button>
            </div>
          </div>
        </div>
      )}
     
    </div>
  );
};

export default ProjectDetail;
