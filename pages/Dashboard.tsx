
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '周一', value: 420 },
  { name: '周二', value: 380 },
  { name: '周三', value: 550 },
  { name: '周四', value: 480 },
  { name: '周五', value: 610 },
  { name: '周六', value: 820 },
  { name: '周日', value: 740 },
];

const StatCard: React.FC<{ title: string; value: string; trend: string; isPositive: boolean }> = ({ title, value, trend, isPositive }) => (
  <div className="apple-card p-8">
    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">{title}</p>
    <h3 className="text-4xl font-bold text-[#1D1D1F] tracking-tighter mb-3">{value}</h3>
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
      <span>{isPositive ? '↑' : '↓'} {trend}</span>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="待审核总量" value="128" trend="12%" isPositive={false} />
        <StatCard title="AI 辅助已完成" value="4,291" trend="18.4%" isPositive={true} />
        <StatCard title="今日处理数" value="32" trend="25%" isPositive={true} />
        <StatCard title="平均准确率" value="98.5%" trend="0.8%" isPositive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 apple-card p-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h4 className="text-xl font-bold text-[#1D1D1F]">系统负载分析</h4>
              <p className="text-xs text-gray-400 mt-1">过去 7 天的审核请求流量波动图</p>
            </div>
            <select className="bg-gray-100 border-none rounded-xl text-xs font-bold px-4 py-2 text-gray-600 focus:ring-0 cursor-pointer">
              <option>本周数据</option>
              <option>本月数据</option>
            </select>
          </div>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000" stopOpacity={0.08}/>
                    <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 600}} dy={15} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                  itemStyle={{ color: '#000', fontWeight: 700 }}
                  labelStyle={{ marginBottom: '4px', fontSize: '12px', color: '#94A3B8' }}
                />
                <Area type="monotone" dataKey="value" stroke="#1D1D1F" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="apple-card p-8 flex flex-col">
          <h4 className="text-xl font-bold text-[#1D1D1F] mb-8">最新动态</h4>
          <div className="space-y-8 flex-1">
            {[
              { title: '《星际穿越》重映版 AI 复核通过', time: '12 分钟前', risk: '低风险', color: 'bg-green-500' },
              { title: '检测到 《未名记录》 存在版权冲突', time: '28 分钟前', risk: '中风险', color: 'bg-amber-500' },
              { title: '《大红灯笼高高挂》数字化修复审核中', time: '1 小时前', risk: '处理中', color: 'bg-blue-500' },
              { title: '用户 092 提交了新的审核申请', time: '2 小时前', risk: '待处理', color: 'bg-gray-300' },
            ].map((item, i) => (
              <div key={i} className="flex gap-5 items-start">
                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${item.color} ring-4 ring-opacity-20 ${item.color.replace('bg-', 'ring-')}`}></div>
                <div>
                  <p className="text-sm font-bold text-[#1D1D1F] leading-tight">{item.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{item.time}</span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                    <span className="text-[10px] font-bold text-gray-500">{item.risk}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 bg-gray-100 text-black text-xs font-bold rounded-2xl hover:bg-black hover:text-white transition-all duration-300 apple-button">
            查看历史日志
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
