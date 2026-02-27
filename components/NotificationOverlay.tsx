
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NotificationItem {
  id: string;
  type: 'success' | 'warning' | 'info' | 'critical';
  title: string;
  content: string;
  time: string;
  unread: boolean;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { 
    id: 'n1', 
    type: 'success', 
    title: '审核通过提醒', 
    content: '《流浪地球 3 预告片》v1.2 终审版本已由系统自动签发，报告已归档。', 
    time: '12 分钟前',
    unread: true 
  },
  { 
    id: 'n2', 
    type: 'info', 
    title: 'AI 分析任务完成', 
    content: '新项目《未命名武侠大片》的关键帧序列分析已完成，共提取 1,240 个特征点。', 
    time: '2 小时前',
    unread: true 
  },
  { 
    id: 'n3', 
    type: 'warning', 
    title: '版本差异预警', 
    content: '检测到 v1.1 与 v1.0 之间存在 42 处显著差异，请及时查看差异报告。', 
    time: '5 小时前',
    unread: false 
  },
  { 
    id: 'n4', 
    type: 'critical', 
    title: '版权冲突提示', 
    content: '《深度空间：孤寂》在 00:00:35:12 处检测到未授权的第三方品牌标识。', 
    time: '14 小时前',
    unread: false 
  },
  { 
    id: 'n5', 
    type: 'info', 
    title: '项目分享', 
    content: '李华 (主任) 向您分享了《流浪地球 3》项目的全量历史审核日志。', 
    time: '22 小时前',
    unread: false 
  },
];

interface NotificationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationOverlay: React.FC<NotificationOverlayProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleGoToManagement = () => {
    onClose();
    navigate('/notifications');
  };

  return (
    <>
      {/* 背景遮罩 */}
      <div 
        className={`fixed inset-0 bg-black/10 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* 侧边弹出面板 */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white/90 backdrop-blur-3xl shadow-[-20px_0_50px_rgba(0,0,0,0.08)] z-[110] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold tracking-tight text-[#1D1D1F]">站内通知</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Status Notifications (Last 24H)</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-all" title="全部设为已读">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
          {MOCK_NOTIFICATIONS.map((item) => (
            <div 
              key={item.id} 
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer group ${item.unread ? 'bg-white border-blue-100 shadow-lg shadow-blue-500/5 ring-1 ring-blue-50' : 'bg-gray-50/50 border-gray-100 opacity-70 hover:opacity-100 hover:bg-white hover:border-gray-200'}`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  item.type === 'success' ? 'bg-green-500' : 
                  item.type === 'warning' ? 'bg-amber-500' : 
                  item.type === 'critical' ? 'bg-red-500' : 'bg-blue-500'
                } ${item.unread ? 'animate-pulse ring-4 ring-opacity-20 ' + (item.type === 'success' ? 'ring-green-500' : item.type === 'warning' ? 'ring-amber-500' : item.type === 'critical' ? 'ring-red-500' : 'ring-blue-500') : ''}`} />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-bold text-[#1D1D1F] uppercase tracking-wider">{item.title}</h3>
                    <span className="text-[10px] text-gray-400 font-medium">{item.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    {item.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="pt-10 pb-6 flex flex-col items-center gap-4 opacity-20 select-none">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2-2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">已显示 24 小时内所有动态</p>
          </div>
        </div>

        <div className="p-8 border-t border-gray-100 bg-gray-50/30">
           <button 
             onClick={handleGoToManagement}
             className="w-full py-4 bg-black text-white rounded-2xl text-xs font-bold shadow-xl shadow-black/10 hover:scale-[1.02] active:scale-95 transition-all"
           >
              进入通知管理中心
           </button>
        </div>
      </aside>
    </>
  );
};

export default NotificationOverlay;
