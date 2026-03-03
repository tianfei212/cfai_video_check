
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ReviewStatus, RiskLevel, FilmVersion } from '../types';
import { getProjectDetailVersions } from '../data/projectVersions';

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const MOCK_VERSIONS: FilmVersion[] = getProjectDetailVersions(t);
  
  const handleViewReport = (version: FilmVersion) => {
    navigate(`/report/${version.id}`, { state: { versionName: version.versionName } });
  };

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
            {t("对比核检")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="px-4 py-2 flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          <div className="flex-1">{t("版本信息")}</div>
          <div className="w-1/6">{t("提交时间")}</div>
          <div className="w-1/6">{t("AI 分数 / 风险")}</div>
          <div className="w-1/6">{t("审核状态")}</div>
          <div className="w-1/6 text-right pr-4">{t("关键帧")}</div>
        </div>

        {MOCK_VERSIONS.map((version, index) => {
          return (
            <div 
              key={version.id} 
              className="apple-card p-6 flex items-center group transition-all duration-500"
            >
              <div className="flex-1 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs bg-gray-50 text-gray-400">
                  V{MOCK_VERSIONS.length - index}
                </div>
                <div>
                  <p className="font-bold text-gray-900 flex items-center gap-2">
                    {version.versionName}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{version.notes}</p>
                </div>
              </div>

              <div className="w-1/6 text-sm text-gray-500 font-medium">
                {version.uploadDate}
              </div>

              <div className="w-1/6">
                <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-tight">{version.aiScore}%</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${version.riskLevel === RiskLevel.LOW ? 'text-green-500' : 'text-amber-500'}`}>
                    {version.riskLevel} Risk
                  </span>
                </div>
              </div>

              <div className="w-1/6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  version.status === ReviewStatus.APPROVED ? 'bg-green-50 text-green-600' : 
                  version.status === ReviewStatus.REJECTED ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {version.status}
                </span>
              </div>

              <div className="w-1/6 text-right flex items-center justify-end gap-3 pr-4">
                
                <button 
                  onClick={() => navigate(`/keyframes/${version.id}`)}
                  className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[11px] font-bold transition-all hover:border-black"
                >
                  {t("关键帧审核")}
                </button>
              </div> 
            </div>
          );
        })}
      </div>

     
    </div>
  );
};

export default ProjectDetail;
