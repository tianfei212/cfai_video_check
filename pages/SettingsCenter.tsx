
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PRESET_COLORS = [
  { name: 'Obsidian', hex: '#1D1D1F' },
  { name: 'Silver', hex: '#F5F5F7' },
  { name: 'Royal Blue', hex: '#0066CC' },
  { name: 'Deep Purple', hex: '#6E56CF' },
  { name: 'Emerald', hex: '#10B981' },
];

const SettingsCenter: React.FC = () => {
  const navigate = useNavigate();
  const [radius, setRadius] = useState(20);
  const [primaryColor, setPrimaryColor] = useState('#1D1D1F');
  const [bgMode, setBgMode] = useState('mesh'); // pure, glass, mesh
  const [density, setDensity] = useState('relaxed'); // compact, standard, relaxed

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-6xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">系统偏好设置</h1>
          <p className="text-gray-400 mt-1">个性化您的工作空间，调整 UI 视觉风格与交互体验</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold hover:bg-gray-50 transition-all">恢复默认</button>
          <button className="px-8 py-3 bg-black text-white rounded-2xl text-xs font-bold shadow-xl shadow-black/10 hover:scale-[1.02] transition-all">应用更改</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* 左侧配置项 */}
        <div className="lg:col-span-2 space-y-8">
          {/* 视觉风格 */}
          <section className="apple-card p-8 border-none shadow-sm bg-white">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">视觉样式 (Visual Style)</h3>
            
            <div className="space-y-10">
              {/* 圆角弧度 */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-bold text-[#1D1D1F]">元素圆角弧度 (Corner Radius)</label>
                  <span className="text-xs font-mono font-bold text-gray-400">{radius}px</span>
                </div>
                <input 
                  type="range" min="0" max="40" value={radius} 
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black" 
                />
                <div className="flex justify-between text-[9px] text-gray-300 font-bold uppercase">
                  <span>Sharp</span>
                  <span>Apple Standard</span>
                  <span>Extra Round</span>
                </div>
              </div>

              {/* 主题色 */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-[#1D1D1F]">品牌主题色 (Primary Color)</label>
                <div className="flex flex-wrap gap-4">
                  {PRESET_COLORS.map(color => (
                    <button 
                      key={color.name}
                      onClick={() => setPrimaryColor(color.hex)}
                      className={`w-10 h-10 rounded-full border-4 transition-all ${primaryColor === color.hex ? 'border-black scale-110 shadow-lg' : 'border-transparent'}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 界面背景 */}
          <section className="apple-card p-8 border-none shadow-sm bg-white">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">界面背景与纹理 (Background)</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'pure', label: '纯净白', desc: '极简专注' },
                { id: 'glass', label: '磨砂玻璃', desc: '层级感强' },
                { id: 'mesh', label: '动态渐变', desc: '艺术美感' },
              ].map(mode => (
                <button 
                  key={mode.id}
                  onClick={() => setBgMode(mode.id)}
                  className={`p-6 rounded-3xl border-2 transition-all text-left group ${bgMode === mode.id ? 'border-black bg-gray-50' : 'border-gray-50 bg-white hover:border-gray-200'}`}
                >
                  <div className={`w-8 h-8 rounded-lg mb-4 ${
                    mode.id === 'pure' ? 'bg-white border border-gray-100' : 
                    mode.id === 'glass' ? 'bg-gray-100/50 backdrop-blur-md border border-white' : 
                    'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100'
                  }`} />
                  <p className="text-xs font-bold text-[#1D1D1F]">{mode.label}</p>
                  <p className="text-[10px] text-gray-400 mt-1 font-medium">{mode.desc}</p>
                </button>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-50">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block">自定义背景图片</label>
               <div className="h-32 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-3 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">上传高清壁纸 (4K Preferred)</span>
               </div>
            </div>
          </section>
        </div>

        {/* 右侧实时预览 */}
        <div className="space-y-8">
           <div className="sticky top-24">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 px-2">实时效果预览 (Live Preview)</h3>
              <div 
                className={`overflow-hidden border border-gray-100 shadow-2xl transition-all duration-700 ${
                  bgMode === 'mesh' ? 'bg-gradient-to-tr from-blue-50/50 via-white to-purple-50/50' : 
                  bgMode === 'glass' ? 'bg-white/40 backdrop-blur-xl' : 'bg-white'
                }`}
                style={{ borderRadius: `${radius * 1.5}px` }}
              >
                <div className="p-10 space-y-8">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 animate-pulse" style={{ borderRadius: `${radius * 0.5}px` }}></div>
                      <div className="space-y-2 flex-1">
                         <div className="h-3 w-2/3 bg-gray-100 rounded-full"></div>
                         <div className="h-2 w-1/3 bg-gray-50 rounded-full"></div>
                      </div>
                   </div>

                   <div 
                    className="p-6 bg-white border border-gray-100 shadow-sm space-y-4"
                    style={{ borderRadius: `${radius}px` }}
                   >
                      <h4 className="text-sm font-bold">交互组件示例</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                        该卡片展示了您当前设置的圆角弧度与间距密度。您可以点击下方按钮查看主题色应用。
                      </p>
                      <button 
                        className="w-full py-3 text-white text-xs font-bold transition-all"
                        style={{ backgroundColor: primaryColor, borderRadius: `${radius * 0.6}px` }}
                      >
                        主要操作按键
                      </button>
                   </div>

                   <div className="flex gap-2">
                      {[1, 2, 3].map(i => (
                        <div 
                          key={i} 
                          className="flex-1 aspect-square bg-gray-50 border border-gray-100"
                          style={{ borderRadius: `${radius * 0.4}px` }}
                        />
                      ))}
                   </div>
                </div>
              </div>

              <div className="mt-10 p-6 rounded-3xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">设置说明</span>
                </div>
                <p className="text-[10px] text-amber-600/80 leading-relaxed font-medium">
                  某些全局样式调整可能需要刷新页面以完整应用。对于大面积背景图，建议使用 2MB 以内的 WebP 格式。
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsCenter;
