
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface NotificationRecord {
  id: string;
  type: 'success' | 'warning' | 'info' | 'critical';
  title: string;
  content: string;
  time: string;
  date: string;
  isRead: boolean;
  project: string;
}

const NotificationManagement: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const MOCK_ALL_NOTIFICATIONS: NotificationRecord[] = [
    { id: 'n1', type: 'success', title: t('审核通过提醒'), content: t('《流浪地球 3 预告片》v1.2 终审版本已由系统自动签发，报告已归档。'), time: '14:20', date: '2023-11-25', isRead: false, project: t('流浪地球 3') },
    { id: 'n2', type: 'info', title: t('AI 分析任务完成'), content: t('新项目《未命名武侠大片》的关键帧序列分析已完成，共提取 1,240 个特征点。'), time: '09:30', date: '2023-11-25', isRead: false, project: t('未命名武侠大片') },
    { id: 'n3', type: 'warning', title: t('版本差异预警'), content: t('检测到 v1.1 与 v1.0 之间存在 42 处显著差异，请及时查看差异报告。'), time: '18:00', date: '2023-11-24', isRead: true, project: t('流浪地球 3') },
    { id: 'n4', type: 'critical', title: t('版权冲突提示'), content: t('《深度空间：孤寂》在 00:00:35:12 处检测到未授权的第三方品牌标识。'), time: '11:15', date: '2023-11-24', isRead: true, project: t('深度空间：孤寂') },
    { id: 'n5', type: 'info', title: t('项目分享'), content: t('李华 (主任) 向您分享了《流浪地球 3》项目的全量历史审核日志。'), time: '10:00', date: '2023-11-23', isRead: true, project: t('流浪地球 3') },
    { id: 'n6', type: 'success', title: t('系统升级完成'), content: t('CAFAI 审核引擎已升级至 v4.5，优化了亚像素级位移检测算法。'), time: '08:00', date: '2023-11-23', isRead: true, project: t('系统消息') },
    { id: 'n7', type: 'warning', title: t('存储空间不足'), content: t('当前 OSS 存储节点空间占用已达 85%，建议清理历史临时序列帧。'), time: '16:40', date: '2023-11-22', isRead: true, project: t('系统消息') },
  ];

  const [notifications, setNotifications] = useState(MOCK_ALL_NOTIFICATIONS);

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">{t("通知管理中心")}</h1>
          <p className="text-gray-400 mt-1">{t("管理并追溯系统下发的所有业务动态与预警通知")}</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={handleMarkAllRead}
             className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
             {t("全部标为已读")}
           </button>
        </div>
      </div>

      {/* 通知列表表格 */}
      <section className="apple-card overflow-hidden border-none shadow-sm bg-white">
        <div className="px-10 py-5 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("通知列表")} ({notifications.length})</span>
           <div className="flex gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{t("未读")}</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{t("已读")}</span>
              </div>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("状态")}</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("通知标题")}</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("所属项目")}</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("内容摘要")}</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("时间点")}</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">{t("操作")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {notifications.map((n) => (
                <tr key={n.id} className={`hover:bg-gray-50/40 transition-colors group ${!n.isRead ? 'bg-blue-50/10' : ''}`}>
                  <td className="px-10 py-6">
                    <div className={`w-2 h-2 rounded-full ${!n.isRead ? 'bg-blue-500 animate-pulse ring-4 ring-blue-500/10' : 'bg-gray-200'}`} />
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col">
                       <span className={`text-sm font-bold ${!n.isRead ? 'text-[#1D1D1F]' : 'text-gray-400'}`}>{n.title}</span>
                       <span className={`text-[10px] font-bold uppercase tracking-tighter ${
                         n.type === 'critical' ? 'text-red-500' : 
                         n.type === 'warning' ? 'text-amber-500' : 
                         n.type === 'success' ? 'text-green-500' : 'text-blue-500'
                       }`}>{n.type}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">{n.project}</span>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-xs text-gray-500 leading-relaxed italic max-w-md truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:line-clamp-none transition-all">“{n.content}”</p>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col">
                       <span className="text-xs font-mono font-bold text-gray-900">{n.time}</span>
                       <span className="text-[10px] font-mono text-gray-400">{n.date}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!n.isRead && (
                        <button 
                          onClick={() => handleMarkRead(n.id)}
                          className="px-4 py-1.5 bg-black text-white text-[10px] font-bold rounded-xl shadow-lg shadow-black/5 hover:scale-105 transition-all"
                        >
                          {t("确认收到")}
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(n.id)}
                        className="p-1.5 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-all"
                        title={t("删除通知")}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {notifications.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-10 py-24 text-center">
                     <div className="flex flex-col items-center gap-4 opacity-20">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
                        <p className="text-sm font-bold uppercase tracking-widest">{t("暂无通知记录")}</p>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 底部功能提示 */}
      <div className="p-8 rounded-[2rem] bg-gray-50/50 border border-gray-100 flex items-center justify-between text-gray-400">
         <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <p className="text-[11px] font-medium leading-relaxed italic">{t("通知中心仅保留最近 30 天的历史记录。重要审核结论请在对应的“审核日志”或“工程详情”中查看并导出 PDF 存证。")}</p>
         </div>
      </div>
    </div>
  );
};

export default NotificationManagement;
