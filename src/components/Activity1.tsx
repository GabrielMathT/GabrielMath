import React, { useEffect, useRef, useState } from 'react';
import { drawArrow } from '../types';
import { Rocket, Target, Info, Zap } from 'lucide-react';

export const Activity1: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k, setK] = useState(1);
  const [l, setL] = useState(1);
  
  const missions = [
    { name: "수성", x: 3, y: 1, color: "#94a3b8" },
    { name: "금성", x: 6, y: 2, color: "#fbbf24" },
    { name: "화성", x: 5, y: 5, color: "#ef4444" },
    { name: "목성", x: 8, y: 4, color: "#d97706" }
  ];
  
  const [activeMission, setActiveMission] = useState(missions[1]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Config
    const offsetX = 60, offsetY = 320, scale = 40;

    // Draw Grid (Lightly)
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= canvas.width; x += scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += scale) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Target Point (Dynamic)
    const targetX = offsetX + activeMission.x * scale;
    const targetY = offsetY - activeMission.y * scale;
    
    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = activeMission.color + "80";
    ctx.fillStyle = activeMission.color;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px Inter";
    ctx.fillText(`${activeMission.name} (${activeMission.x}, ${activeMission.y})`, targetX + 15, targetY);

    // Origin
    ctx.fillStyle = "#1e293b";
    ctx.beginPath(); ctx.arc(offsetX, offsetY, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillText("지구 (O)", offsetX - 40, offsetY + 20);

    // Vector a: (1, 1) * k
    const ax = k * 1 * scale;
    const ay = -k * 1 * scale;
    drawArrow(ctx, offsetX, offsetY, offsetX + ax, offsetY + ay, "#3b82f6", `k·a`);
    
    // Vector b: (2, 0) * l (Chained from end of a)
    const bx = l * 2 * scale;
    const by = 0;
    drawArrow(ctx, offsetX + ax, offsetY + ay, offsetX + ax + bx, offsetY + ay + by, "#10b981", `l·b`);

    // Helper: Final Vector Resultant
    drawArrow(ctx, offsetX, offsetY, offsetX + ax + bx, offsetY + ay + by, "#6366f1", "", true);
  };

  useEffect(() => {
    draw();
  }, [k, l, activeMission]);

  const finalX = (k * 1 + l * 2);
  const finalY = k * 1;
  const isWinner = Math.abs(finalX - activeMission.x) < 0.1 && Math.abs(finalY - activeMission.y) < 0.1;

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start relative overflow-hidden">
      {/* Background Watermark */}
      <div 
        className="absolute inset-x-0 top-40 h-[60%] pointer-events-none opacity-[0.03] flex items-center justify-center z-0"
        style={{ 
          backgroundImage: 'url("/logo.png")', 
          backgroundSize: 'contain', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat',
          filter: 'grayscale(1)' 
        }}
      />
      
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500 rounded-lg text-white">
              <Rocket size={20} />
            </div>
            <h3 className="font-bold text-blue-900 text-lg">우주선 항로 설계</h3>
          </div>
          <p className="text-sm text-blue-700 leading-relaxed">
            연료 <b>a (1, 1)</b>와 <b>b (2, 0)</b>를 조합하여 목표 행성에 도달하세요.
          </p>
        </div>

        {/* Mission Presets & Custom Coordinates */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <Target size={14} className="text-slate-400" /> 탐사지 설정
            </h4>
            <span className="text-[10px] font-bold text-blue-500 border border-blue-200 px-1.5 py-0.5 rounded uppercase">Manual Mode</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {missions.map(m => (
              <button
                key={m.name}
                onClick={() => setActiveMission(m)}
                className={`p-2 rounded-xl text-xs font-bold transition-all border ${activeMission.name === m.name ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'}`}
              >
                {m.name}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Target X</label>
              <input 
                type="number" 
                value={activeMission.x} 
                onChange={(e) => setActiveMission({...activeMission, name: "사용자 지정", x: parseFloat(e.target.value) || 0})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Target Y</label>
              <input 
                type="number" 
                value={activeMission.y} 
                onChange={(e) => setActiveMission({...activeMission, name: "사용자 지정", y: parseFloat(e.target.value) || 0})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Fuel Inputs (Direct Numbers) */}
        <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2 mb-2">
            <Zap size={14} className="text-slate-400" /> 연료 주입 (Scalar)
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-blue-600">연료 a</label>
              </div>
              <input 
                type="number" 
                step="0.1"
                value={k} 
                onChange={(e) => setK(parseFloat(e.target.value) || 0)}
                className="w-full bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-lg font-mono font-bold text-blue-700 focus:ring-2 focus:ring-blue-500 outline-none text-center"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-emerald-600">연료 b</label>
              </div>
              <input 
                type="number" 
                step="0.1"
                value={l} 
                onChange={(e) => setL(parseFloat(e.target.value) || 0)}
                className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-lg font-mono font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-500 outline-none text-center"
              />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 italic text-center">직접 숫자를 입력하여 세밀한 항로를 설계하세요.</p>
        </div>

        <div className={`p-5 rounded-2xl border transition-all duration-300 ${isWinner ? 'bg-emerald-50 border-emerald-200 shadow-emerald-100' : 'bg-slate-100 border-slate-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className={isWinner ? 'text-emerald-600' : 'text-slate-500'} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">실시간 위치 분석</span>
          </div>
          <p className="text-xl font-mono font-bold text-slate-800">
            현재 위치: <span className={isWinner ? "text-emerald-600" : "text-indigo-600"}>({finalX.toFixed(1)}, {finalY.toFixed(1)})</span>
          </p>
          {isWinner ? (
            <p className="mt-3 text-sm font-bold text-emerald-600 flex items-center gap-2">
              ✨ 항로 설계 완료! {activeMission.name} 착륙 성공!
            </p>
          ) : (
            <p className="mt-3 text-xs text-slate-500 italic flex items-center gap-1">
              <Info size={12} /> ({activeMission.x.toFixed(1)}, {activeMission.y.toFixed(1)})에 도달할 수 있도록 연료량을 조절하세요.
            </p>
          )}
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
          <h4 className="font-bold text-slate-800 text-sm border-b pb-2">💡 탐구 질문</h4>
          <ul className="text-xs text-slate-600 space-y-3 leading-relaxed">
            <li>• 연료 <b>a</b>를 1배 늘릴 때마다 위치는 어떻게 변하나요?</li>
            <li>• 만약 연료 <b>a</b>의 배수를 고정하고 <b>b</b>만 조절한다면, 우주선은 어떤 선을 그리며 움직이게 될까요?</li>
            <li>• 금성(6, 2)에 도착하기 위한 <b>a</b>와 <b>b</b>의 유일한 조합을 수식으로 찾아낼 수 있을까요?</li>
          </ul>
        </div>
      </div>

      <div className="lg:col-span-2 relative group">
        <div className="absolute inset-0 bg-slate-200 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={400} 
          className="w-full h-auto bg-white border border-slate-200 rounded-3xl shadow-xl relative"
        />
        <div className="absolute bottom-4 right-6 text-[10px] text-slate-400 font-mono uppercase tracking-widest pointer-events-none">
          Sector Grid: 1.0 Unit / Radial Gradient Enabled
        </div>
      </div>

      {/* Creator Credit */}
      <div className="mt-8 pt-8 border-t border-slate-200 flex justify-between items-center px-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mb-1">Author & Designer</span>
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-10 h-10 object-contain" 
              onError={(e) => (e.currentTarget.style.display = 'none')} 
            />
            <span className="text-sm font-display font-bold text-slate-600">제작자 : Gabriel Math (Gabriel Byeongje Jeon)</span>
          </div>
        </div>
        <span className="text-[10px] text-slate-300 font-mono text-right">Discover Math Laboratory © 2026</span>
      </div>
    </div>
  );
};
