
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean }> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
      active 
        ? 'bg-[#1D1D1F] text-white shadow-xl shadow-gray-200' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    {icon}
    <span className="text-sm font-semibold tracking-tight">{label}</span>
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { to: '/', label: '控制中心', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"/></svg> },
    { to: '/list', label: '审片队列', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg> },
  ];

  return (
    <div className="flex h-screen w-full bg-[#FBFBFD] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col p-6 z-30">
        <div className="mb-12 px-2 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold italic shadow-lg">C</div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold tracking-tight text-[#1D1D1F] leading-tight">中国电影AI研究院</h1>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">Film AI Institute</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          {navItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))}
            />
          ))}
        </nav>

        <div className="mt-auto">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
            <div className="relative">
              <img src="https://picsum.photos/id/64/80/80" alt="Avatar" className="w-11 h-11 rounded-2xl object-cover shadow-sm" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1D1D1F] truncate">李华 (主任)</p>
              <p className="text-[11px] text-gray-500 font-medium">专家审核员</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 apple-blur border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-20">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
                {location.pathname === '/' ? '数据总览' : location.pathname.startsWith('/list') ? '影片管理' : '工作空间'}
             </h2>
             <span className="w-px h-6 bg-gray-200 mx-2"></span>
             <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
               {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
             </p>
          </div>
          <div className="flex items-center gap-8">
            <button className="text-gray-400 hover:text-black transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
            <button className="text-gray-400 hover:text-black transition-colors relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-10">
          {children}
        </div>
      </main>
    </div>
  );
};
