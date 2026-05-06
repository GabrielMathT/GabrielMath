import React, { useEffect, useRef, useState } from 'react';
import { drawArrow } from '../types';
import { motion } from 'motion/react';
import { Scale, Activity, Brain, Zap, Compass } from 'lucide-react';

export const Activity3: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(45);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Check if rect has dimensions to avoid division by zero or empty canvas
    if (rect.width === 0 || rect.height === 0) return;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);
    const centerX = rect.width / 2;
    const centerY = 140; 
    const weightLen = 140; 
    const angleRad = (angle * Math.PI) / 180;

    // Background effects
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 300);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#f8fafc');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Gravity Vector (Down)
    drawArrow(ctx, centerX, centerY, centerX, centerY + weightLen, "#ef4444", "w (중력 200N)");

    // Force Calculation
    // Tension T: 2 * T * cos(angle) = W => T = W / (2 * cos(angle))
    const tension = weightLen / (2 * Math.cos(angleRad));
    const tx = tension * Math.sin(angleRad);
    const ty = -tension * Math.cos(angleRad);

    // Ceiling
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centerX - 160, centerY + ty - 20);
    ctx.lineTo(centerX + 160, centerY + ty - 20);
    ctx.stroke();
    
    // Support Lines (Decorative)
    ctx.lineWidth = 1;
    for(let i=-160; i<=160; i+=10) {
      ctx.beginPath(); 
      ctx.moveTo(centerX + i, centerY + ty - 20);
      ctx.lineTo(centerX + i + 5, centerY + ty - 30);
      ctx.stroke();
    }

    // Tension Vectors (f1, f2)
    drawArrow(ctx, centerX, centerY, centerX - tx, centerY + ty, "#3b82f6", `f1 (${Math.round(tension)}N)`);
    drawArrow(ctx, centerX, centerY, centerX + tx, centerY + ty, "#3b82f6", `f2 (${Math.round(tension)}N)`);

    // Sum of Forces (Upward) - Visualization
    drawArrow(ctx, centerX, centerY, centerX, centerY - weightLen, "#f59e0b", "f1 + f2 (합력 200N)", true);

    // Weight Object
    ctx.shadowBlur = 15; ctx.shadowColor = "rgba(0,0,0,0.1)";
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(centerX - 30, centerY + weightLen, 60, 60, 8);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "white";
    ctx.font = "bold 12px Inter";
    ctx.textAlign = "center";
    ctx.fillText("200N", centerX, centerY + weightLen + 35);
  };

  useEffect(() => {
    draw();
  }, [angle]);

  const tensionValue = Math.round(140 / (2 * Math.cos((angle * Math.PI) / 180)) * 1.4); // Scale for label "realism"

  return (
    <div className="flex flex-col gap-10 relative">
      {/* Background Watermark */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center z-0"
        style={{ 
          backgroundImage: 'url("/logo.png")', 
          backgroundSize: '40% auto', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat',
          filter: 'grayscale(1)' 
        }}
      />
      
      {/* Header & Intro */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 bg-red-100 px-3 py-1 rounded-full text-red-700 text-xs font-bold">
          <Scale size={14} /> 힘의 평형 학습
        </div>
        <h3 className="text-3xl font-bold text-slate-900 leading-tight">장력 공식의 유도와 시뮬레이션</h3>
        <p className="text-slate-600 text-base max-w-3xl leading-relaxed">
          추의 무게(중력)는 항상 아래를 향하지만, 이를 지탱하는 두 실의 방향은 각도에 따라 변합니다. 
          먼저 수학적으로 공식을 유도해보고, 아래의 시뮬레이션을 통해 각도가 넓어질수록 실이 버텨야 하는 힘이 어떻게 변하는지 확인해 봅시다.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Step 1: Derivation Lab */}
        <div className="w-full bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
              <Brain size={24} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-800 tracking-tight">장력 공식의 유도 과정</h4>
              <p className="text-sm text-slate-500">벡터의 분해를 이용해 학술적인 기초를 다져봅시다.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl space-y-2">
              <h5 className="text-sm font-bold text-slate-700">1. 수직 방향의 평형 조건</h5>
              <p className="text-xs text-slate-500 leading-relaxed">
                물체의 무게를 W, 장력을 T라 할 때, 
                장력 T의 수직 성분 Ty는 어떻게 표현될까요?
              </p>
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <textarea 
                  placeholder=""
                  className="flex-1 w-full h-20 bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none mt-2"
                />
                {/* Small static illustration - fixed size, no movement */}
                <div className="w-full md:w-48 h-32 bg-white border border-slate-200 rounded-xl relative overflow-hidden flex-shrink-0 flex items-center justify-center p-2 shadow-inner">
                   <svg viewBox="0 0 160 100" className="w-full h-full">
                     {/* Ceiling */}
                     <line x1="20" y1="15" x2="140" y2="15" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                     {/* Tension lines */}
                     <line x1="80" y1="50" x2="50" y2="15" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                     <line x1="80" y1="50" x2="110" y2="15" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                     {/* Gravity line */}
                     <line x1="80" y1="50" x2="80" y2="80" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                     {/* Weight */}
                     <rect x="68" y="80" width="24" height="18" rx="2" fill="#1e293b" />
                     <text x="80" y="92" fontSize="6" fill="white" fontWeight="bold" textAnchor="middle">W</text>
                     {/* Labels */}
                     <text x="50" y="42" fontSize="10" fill="#3b82f6" fontWeight="bold" style={{ fontStyle: 'italic' }}>T</text>
                     <text x="105" y="42" fontSize="10" fill="#3b82f6" fontWeight="bold" style={{ fontStyle: 'italic' }}>T</text>
                   </svg>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2">
              <h5 className="text-sm font-bold text-slate-700">2. 알짜힘 방정식</h5>
              <p className="text-xs text-slate-500 leading-relaxed">
                두 실의 수직 성분 합(2 · Ty)이 중력(W)과 같아야 합니다. 
                T에 관한 최종 공식을 유도해 보세요.
              </p>
              <textarea 
                placeholder=""
                className="w-full h-24 bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono mt-2"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Interactive Simulation */}
        <div className="w-full flex flex-col gap-8">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-6">
            <div className="flex flex-col items-center">
            <canvas
              ref={canvasRef}
              style={{ width: '100%', aspectRatio: '1.25/1' }}
              className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden"
            />
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">실 사이의 각도 (θ)</span>
                  <span className="text-2xl font-display font-bold text-blue-600">{angle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="85"
                  value={angle}
                  onChange={(e) => setAngle(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>수직 (0°)</span>
                  <span>수평 (85°)</span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl shadow-inner">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">계산된 장력 (T)</span>
                  <span className="text-white text-xs font-mono font-medium">T = W / (2·cosθ)</span>
                </div>
                <span className={`text-2xl font-mono font-bold ${angle > 75 ? 'text-red-400' : 'text-blue-400'}`}>
                  {angle >= 90 ? '∞' : `${tensionValue} N`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discovery & Insights */}
      <div className="w-full space-y-8 pb-12">
        <div className="w-full bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
          <h4 className="font-bold text-slate-800 text-xl flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Activity size={24} />
            </div>
            탐구 및 실험 보고서
          </h4>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-full uppercase inline-block">Task 01</span>
              <p className="text-lg text-slate-800 leading-relaxed font-bold">각도 0도에서의 관찰</p>
              <p className="text-base text-slate-600 leading-relaxed">각도를 0도로 설정했을 때, 장력은 중력의 정확히 절반(100N)이 되나요? 그 이유를 설명하세요.</p>
              <textarea className="w-full bg-white border border-slate-200 rounded-xl p-4 text-base h-24 outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="여기에 입력..." />
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-full uppercase inline-block">Task 02</span>
              <p className="text-lg text-slate-800 leading-relaxed font-bold">임계 각도 도전</p>
              <p className="text-base text-slate-600 leading-relaxed">각도가 60도가 되었을 때 장력은 어떻게 변하나요? (cos 60° = 0.5임을 상기하세요)</p>
              <textarea className="w-full bg-white border border-slate-200 rounded-xl p-4 text-base h-24 outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="계산 과정을 기록..." />
            </div>
          </div>
        </div>

        <div className="w-full bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-xl text-slate-300 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4 flex-1">
              <h4 className="text-xl font-bold text-white flex items-center gap-3">
                <Zap size={24} className="text-blue-400" />
                핵심 포인트
              </h4>
              <ul className="text-base space-y-4 text-slate-400">
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">•</span>
                  장력의 수직 성분(T cosθ)이 중력의 절반을 담당합니다.
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">•</span>
                  각도가 90도에 가까워질수록 cosθ는 0에 수렴하여 장력은 무한대로 커집니다.
                </li>
              </ul>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 md:max-w-xs">
              <p className="text-base font-medium italic text-slate-200 leading-relaxed">
                "절대로 실을 완전히 수평으로 팽팽하게 당길 수 없습니다. 왜일까요?"
              </p>
            </div>
          </div>
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
