
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface VersionIssue {
  id: string;
  version: string;
  timecode: string;
  type: '品牌风险' | '画质缺陷' | '内容违规' | '技术规范';
  description: string;
  status: '已修正' | '待处理' | '忽略';
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface ComparisonLog {
  id: string;
  baseVersion: string;
  targetVersion: string;
  diffCount: number;
  operator: string;
  conclusion: string;
  date: string;
}

const MOCK_FILMS = [
  { id: '1001', title: '流浪地球 3 预告片' },
  { id: '1002', title: '未命名武侠大片' },
  { id: '1003', title: '深度空间：孤寂' },
];

const MOCK_VERSION_ISSUES: Record<string, VersionIssue[]> = {
  '1001': [
    { id: 'i1', version: 'v1.2', timecode: '00:01:22:04', type: '技术规范', description: '色彩空间 Rec.2020 转换轻微偏差', status: '已修正', risk: 'LOW' },
    { id: 'i2', version: 'v1.1', timecode: '00:00:35:12', type: '品牌风险', description: '背景广告牌 Logo 未完全遮盖', status: '已修正', risk: 'MEDIUM' },
    { id: 'i3', version: 'v1.1', timecode: '00:02:10:15', type: '画质缺陷', description: '暗部细节出现 4:2:0 采样色度块', status: '忽略', risk: 'LOW' },
    { id: 'i4', version: 'v1.0', timecode: '00:00:42:01', type: '内容违规', description: '敏感字符出现在背景滚动屏', status: '已修正', risk: 'HIGH' },
    { id: 'i5', version: 'v1.0', timecode: '00:01:45:22', type: '品牌风险', description: '主要角色饮品包装露出', status: '已修正', risk: 'MEDIUM' },
  ],
  '1002': [
    { id: 'i6', version: 'v1.1', timecode: '00:15:22:11', type: '内容违规', description: '动作戏中道具血迹过量', status: '待处理', risk: 'MEDIUM' },
    { id: 'i7', version: 'v1.0', timecode: '00:10:05:00', type: '画质缺陷', description: '镜头边缘色散严重', status: '忽略', risk: 'LOW' },
  ]
};

const MOCK_COMPARISON_LOGS: Record<string, ComparisonLog[]> = {
  '1001': [
    { id: 'c1', baseVersion: 'v1.0', targetVersion: 'v1.1', diffCount: 24, operator: '李华', conclusion: '存在未授权 Logo', date: '2023-11-24 10:15' },
    { id: 'c2', baseVersion: 'v1.1', targetVersion: 'v1.2', diffCount: 16, operator: '张伟', conclusion: '风险项已修正', date: '2023-11-25 14:20' },
  ],
  '1002': [
    { id: 'c3', baseVersion: 'v1.0', targetVersion: 'v1.1', diffCount: 53, operator: '王芳', conclusion: '需大幅修改', date: '2023-11-23 16:45' },
  ]
};

const AuditHistory: React.FC = () => {
  const { t } = useTranslation();
  const [selectedFilmId, setSelectedFilmId] = useState(MOCK_FILMS[0].id);

  const currentIssues = MOCK_VERSION_ISSUES[selectedFilmId] || [];
  const currentLogs = MOCK_COMPARISON_LOGS[selectedFilmId] || [];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* 顶部筛选区 */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">{t("审核日志")}</h1>
          <p className="text-gray-400 mt-1">{t("追溯影片各版本内容检测结果与比对历史")}</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("选择关联影片")}</label>
          <select 
            value={selectedFilmId}
            onChange={(e) => setSelectedFilmId(e.target.value)}
            className="bg-white border border-gray-100 rounded-2xl px-6 py-3 text-sm font-bold shadow-sm focus:ring-4 focus:ring-black/5 outline-none cursor-pointer min-w-[240px]"
          >
            {MOCK_FILMS.map(film => (
              <option key={film.id} value={film.id}>{t(film.title)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 上部分：版本内容审核详情表格 */}
      <section className="apple-card overflow-hidden border-none shadow-sm bg-white">
        <div className="px-10 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-900 text-white">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2"/></svg>
            <h3 className="text-sm font-bold uppercase tracking-widest">{t("全版本内容审核记录 (Audit Items)")}</h3>
          </div>
          <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{t("基于 AI 特征向量全量检测")}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("版本")}</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("时间轴 (TC)")}</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("问题类别")}</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("描述信息")}</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("风险等级")}</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("处理状态")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-10 py-6">
                    <span className="text-xs font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">{issue.version}</span>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-sm font-mono font-bold text-blue-600">{issue.timecode}</span>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-xs font-bold text-gray-700">{t(issue.type)}</span>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-xs text-gray-500 leading-relaxed italic line-clamp-1 group-hover:line-clamp-none transition-all">“{t(issue.description)}”</p>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      issue.risk === 'HIGH' ? 'text-red-500' : issue.risk === 'MEDIUM' ? 'text-amber-500' : 'text-green-500'
                    }`}>
                      {t(issue.risk)}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      issue.status === '已修正' ? 'bg-green-50 text-green-600' : 
                      issue.status === '待处理' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {t(issue.status)}
                    </span>
                  </td>
                </tr>
              ))}
              {currentIssues.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-10 py-20 text-center text-gray-300 text-sm italic">{t("该影片暂无内容审核记录")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 下部分：版本对比审核统计表格 */}
      <section className="apple-card overflow-hidden border-none shadow-sm bg-white">
        <div className="px-10 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
          <div className="flex items-center gap-3">
             <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t("历史版本对比记录 (Comparison History)")}</h3>
          </div>
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{t("共")} {currentLogs.length} {t("条对比记录")}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("基准版本 (Base)")}</th>
                <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("目标版本 (Target)")}</th>
                <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("差异点总数")}</th>
                <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("执行操作员")}</th>
                <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("最终结论")}</th>
                <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("记录时间")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/40 transition-colors group">
                  <td className="px-10 py-7">
                    <span className="px-3 py-1.5 bg-gray-100 text-[#1D1D1F] text-xs font-mono font-bold rounded-lg">{log.baseVersion}</span>
                  </td>
                  <td className="px-10 py-7">
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-mono font-bold rounded-lg">{log.targetVersion}</span>
                  </td>
                  <td className="px-10 py-7">
                    <span className="text-sm font-bold text-gray-700">{log.diffCount} {t("个采样点")}</span>
                  </td>
                  <td className="px-10 py-7">
                    <span className="text-sm font-medium text-gray-500">{t(log.operator)}</span>
                  </td>
                  <td className="px-10 py-7">
                    <span className="text-xs font-bold text-[#1D1D1F]">{t(log.conclusion)}</span>
                  </td>
                  <td className="px-10 py-7">
                    <span className="text-xs font-mono text-gray-400">{log.date}</span>
                  </td>
                </tr>
              ))}
              {currentLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-10 py-20 text-center text-gray-300 text-sm italic">{t("暂无对比审核记录")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AuditHistory;
