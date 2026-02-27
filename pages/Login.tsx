
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // 模拟登录加载效果
    setTimeout(() => {
      setLoading(false);
      navigate('/list');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-[#FBFBFD] flex items-center justify-center z-[100]">
      {/* 背景装饰轨迹 */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gray-100/50 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-[420px] px-6">
        <div className="apple-card p-10 bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white text-3xl font-bold italic mb-6 shadow-xl">
              C
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">欢迎回来</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">中国电影人工智能研究院</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">工作账号</label>
              <input 
                type="text" 
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-gray-200 transition-all outline-none"
                placeholder="请输入您的 ID"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">安全密钥</label>
              <input 
                type="password" 
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-gray-200 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded-lg border-gray-200 text-black focus:ring-0" />
                <span className="text-xs text-gray-500 font-medium">保持登录</span>
              </label>
              <a href="#" className="text-xs text-gray-400 hover:text-black transition-colors">忘记密码？</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full mt-4 py-4 bg-[#1D1D1F] text-white rounded-2xl text-sm font-bold shadow-lg shadow-black/10 hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : '进入工作空间'}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-10 text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em]">
          China Academy of Film Artificial Intelligence
        </p>
      </div>
    </div>
  );
};

export default Login;
