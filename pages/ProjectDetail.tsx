
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReviewStatus, RiskLevel, FilmVersion } from '../types';

const MOCK_VERSIONS: FilmVersion[] = [
  { id: 'v-102', versionName: 'v1.2 (终审版)', uploadDate: '2023-11-25 14:20', status: ReviewStatus.APPROVED, aiScore: 99, riskLevel: RiskLevel.LOW, notes: '根据第二次 AI 反馈修正了背景 logo 侵权风险。' },
  { id: 'v-101', versionName: 'v1.1 (修改版)', uploadDate: '2023-11-24 09:30', status: ReviewStatus.REJECTED, aiScore: 82, riskLevel: RiskLevel.MEDIUM, notes: 'AI 检测到第 42 秒存在未授权标志。' },
  { id: 'v-100', versionName: 'v1.0 (原始素材)', uploadDate: '2023-11-23 18:00', status: ReviewStatus.FLAGGED, aiScore: 65, riskLevel: RiskLevel.HIGH, notes: '初次导入，自动启动全量扫描。' },
];

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
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
                <h1 className="text-3xl font-bold tracking-tight">流浪地球 3 预告片</h1>
                <span className="px-2 py-1 bg-black text-white text-[10px] font-bold rounded-lg uppercase tracking-widest">Active Project</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">
                 <span>项目编号: PJ-{id}</span>
                 <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                 <span>中影集团</span>
                 <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                 <span>共 {MOCK_VERSIONS.length} 个版本</span>
              </div>
           </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/import', { state: { fromProject: true, projectName: '流浪地球 3 预告片' } })}
            className="apple-button px-6 py-3 bg-black text-white text-sm font-bold shadow-xl shadow-black/10 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            上传新版本
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="px-4 py-2 flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          <div className="flex-1">版本信息</div>
          <div className="w-1/6">提交时间</div>
          <div className="w-1/6">AI 分数 / 风险</div>
          <div className="w-1/6">审核状态</div>
          <div className="w-1/6 text-right pr-4">操作</div>
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
                  onClick={() => navigate(`/analysis/${version.id}`)}
                  className="px-4 py-2 bg-gray-100 text-[#1D1D1F] rounded-xl text-[11px] font-bold transition-all hover:bg-black hover:text-white flex items-center gap-2 group/btn"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  <span>视频分析</span>
                </button>
                <button 
                  onClick={() => handleViewReport(version)}
                  className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[11px] font-bold transition-all hover:border-black"
                >
                  查看报告
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6 pt-4">
         <div className="apple-card p-8 border-none bg-blue-50/30">
            <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4">版本迭代效率</h4>
            <p className="text-3xl font-bold tracking-tighter text-blue-600">平均 2.4 天</p>
            <p className="text-xs text-blue-400/80 mt-2">高于行业平均水平 15%</p>
         </div>
         <div className="apple-card p-8 border-none bg-green-50/30">
            <h4 className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-4">AI 检测召回率</h4>
            <p className="text-3xl font-bold tracking-tighter text-green-600">99.2%</p>
            <p className="text-xs text-green-400/80 mt-2">基于大模型深度语义分析</p>
         </div>
         <div className="apple-card p-8 border-none bg-gray-50">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">存储占用 (OSS)</h4>
            <p className="text-3xl font-bold tracking-tighter text-gray-600">1.2 TB</p>
            <p className="text-xs text-gray-400/80 mt-2">含 4K 全量序列帧备份</p>
         </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
