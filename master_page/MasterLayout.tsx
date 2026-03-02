
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NotificationOverlay from '../components/NotificationOverlay';

const NavLink: React.FC<{ to: string; label: string; active: boolean }> = ({ to, label, active }) => (
  <Link
    to={to}
    className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
      active ? 'text-black bg-gray-100' : 'text-gray-500 hover:text-black'
    }`}
  >
    {label}
  </Link>
);

const SidebarItem: React.FC<{ to?: string; icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void; isExpandable?: boolean; isExpanded?: boolean }> = ({ to, icon, label, active, onClick, isExpandable, isExpanded }) => {
  const content = (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer ${
        active 
          ? 'bg-black text-white shadow-lg' 
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {icon}
      <span className="text-sm font-bold tracking-tight flex-1">{label}</span>
      {isExpandable && (
        <svg 
          className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </div>
  );

  if (to && !isExpandable) {
    return <Link to={to}>{content}</Link>;
  }
  return content;
};

const TreeItem: React.FC<{ 
  label: string; 
  level: number; 
  children?: React.ReactNode;
  to?: string;
  active?: boolean;
}> = ({ label, level, children, to, active }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = !!children;
  const rowClassName = `
    flex items-center gap-2 py-2 px-4 rounded-lg cursor-pointer transition-all text-sm
    ${level === 1 ? 'font-bold text-gray-700 hover:bg-gray-50' : 'text-gray-500 hover:text-black hover:bg-gray-50'}
    ${active ? 'bg-gray-100 text-black' : ''}
  `;
  const rowStyle = { paddingLeft: `${level * 16}px` };
  const handleClick = () => {
    if (!hasChildren) return;
    setIsOpen(!isOpen);
  };

  if (to && !hasChildren) {
    return (
      <div className="flex flex-col group/tree">
        <Link to={to} className={rowClassName} style={rowStyle}>
          <div className="w-3" />
          <span className="flex-1">{label}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col group/tree">
      <div 
        onClick={handleClick}
        className={rowClassName}
        style={rowStyle}
      >
        {hasChildren && (
          <svg 
            className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        )}
        {!hasChildren && <div className="w-3" />}
        {to ? (
          <Link to={to} className="flex-1" onClick={(e) => hasChildren && e.stopPropagation()}>{label}</Link>
        ) : (
          <span className="flex-1">{label}</span>
        )}
      </div>
      {isOpen && children && (
        <div className="flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};

export const MasterLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMovieLibExpanded, setIsMovieLibExpanded] = useState(false);

  // 模拟的影片数据结构
  const movieData = [
    {
      id: 'm1',
      name: '流浪地球 3',
    },
    {
      id: 'm2',
      name: '封神第二部',
    }
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-[#FBFBFD] text-[#1D1D1F] overflow-hidden">
      {/* 顶部菜单栏 Top Menu Bar */}
      <header className="h-16 apple-blur border-b border-gray-100 flex items-center justify-between px-6 z-[60] sticky top-0">
        <div className="flex items-center gap-4">
          {/* 侧边栏切换按钮 Apple Style Sidebar Toggle */}
          <button 
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-black"
            title={isSidebarOpen ? t("隐藏侧边栏") : t("显示侧边栏")}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2 ml-2">
            <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center text-white font-bold italic text-xs">C</div>
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-tight leading-none">{t("中国电影AI研究院")}</span>
              <span className="text-[7px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Audit System</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-1 ml-6">
            <NavLink to="/list" label={t("工作台")} active={location.pathname === '/list'} />
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-1.5 border border-transparent focus-within:border-gray-200 focus-within:bg-white transition-all">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsNotificationOpen(true)}
                className={`relative p-1.5 rounded-lg transition-all duration-300 ${isNotificationOpen ? 'text-black bg-gray-100' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
               <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
             </button>
             <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity">
               <img src="https://picsum.photos/id/64/32/32" alt="profile" />
             </div>
          </div>
        </div>
      </header>

      {/* 主体容器 */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* 左侧边栏 - 带滑动动画 */}
        <aside 
          className={`
            fixed lg:relative z-40 h-full bg-white border-r border-gray-100 flex flex-col p-6 
            transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
            ${isSidebarOpen ? 'w-64 translate-x-0 opacity-100' : 'w-0 -translate-x-full opacity-0'}
          `}
        >
          <div className="space-y-2 flex-1">
            <p className="px-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-4">{t("核心业务")}</p>
            
            {/* 影片库 - Tree 结构 */}
            <SidebarItem 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>}
              label={t("影片库")}
              onClick={() => setIsMovieLibExpanded(!isMovieLibExpanded)}
              isExpandable={true}
              isExpanded={isMovieLibExpanded}
              active={location.pathname === '/list' || location.pathname.startsWith('/project/')}
            />
            {isMovieLibExpanded && (
              <div className="ml-4 mt-1 space-y-1 border-l border-gray-100 animate-in slide-in-from-top-2 duration-300">
                {movieData.map(movie => (
                  <TreeItem 
                    key={movie.id} 
                    label={movie.name} 
                    level={1}
                    to={`/project/${movie.id}`}
                    active={location.pathname === `/project/${movie.id}`}
                  />
                ))}
              </div>
            )}

            <SidebarItem 
              to="/audit/history"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2"/></svg>}
              label={t("审核日志")}
              active={location.pathname === '/audit/history'}
            />
          </div>
          <div className="mt-auto space-y-2 pt-6 border-t border-gray-50">
            <SidebarItem 
              to="/settings" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>} 
              label={t("设置中心")} 
              active={location.pathname === '/settings'} 
            />
            <Link 
              to="/login"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all duration-300 whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              <span className="text-sm font-bold tracking-tight">{t("安全退出")}</span>
            </Link>
          </div>
        </aside>

        {/* 右侧内容区 - 宽度自适应 */}
        <div className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-500 ease-in-out`}>
          <main className="flex-1 p-4 lg:p-6 overflow-y-auto no-scrollbar">
            <div className="w-full h-full flex flex-col">
              {children}
            </div>
          </main>

          {/* 页脚 Footer */}
          <footer className="px-6 py-4 border-t border-gray-100 bg-white/50 backdrop-blur-sm">
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col items-center md:items-start text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                <span>China Academy of Film Artificial Intelligence</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[9px] font-bold text-gray-200 uppercase tracking-widest">CAF-AI Audit Platform v2.5</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
      
      {/* 通知中心弹窗 Overlay */}
      <NotificationOverlay 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />

      {/* 移动端遮罩 */}
      {(!isSidebarOpen && window.innerWidth < 1024) && (
        <div 
          className="fixed inset-0 bg-black/5 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};
