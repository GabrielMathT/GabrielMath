import React, { useEffect, useRef, useState } from 'react';
import { drawArrow, Point } from '../types';
import { motion } from 'motion/react';
import { Eye, MousePointer2, Layers, Zap, Brain, Info } from 'lucide-react';

export const Activity2: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [posA, setPosA] = useState<Point>({ x: 200, y: 260 });
  const [posB, setPosB] = useState<Point>({ x: 450, y: 150 });
  const [dragging, setDragging] = useState<'A' | 'B' | null>(null);
  
  // Interactive Challenge State
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false); // New: 관점의 이동 모드
  const [drawingStart, setDrawingStart] = useState<Point | null>(null);
  const [drawingEnd, setDrawingEnd] = useState<Point | null>(null);
  const [lastCompletedVector, setLastCompletedVector] = useState<{start: Point, end: Point} | null>(null);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rawOrigin = { x: 80, y: 340 };
    
    // 관점의 이동 모드일 때: A가 새로운 원점이 됨
    const viewOffset = isTranslated ? { x: rawOrigin.x - posA.x, y: rawOrigin.y - posA.y } : { x: 0, y: 0 };
    const origin = isTranslated ? { x: rawOrigin.x, y: rawOrigin.y } : rawOrigin;
    
    const renderPosA = isTranslated ? origin : posA;
    const renderPosB = isTranslated ? { x: posB.x + viewOffset.x, y: posB.y + viewOffset.y } : posB;

    // Background Grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    // Position vectors (from origin)
    if (!isTranslated) {
      drawArrow(ctx, origin.x, origin.y, posA.x, posA.y, "#cbd5e1", "a", true);
      drawArrow(ctx, origin.x, origin.y, posB.x, posB.y, "#cbd5e1", "b", true);
    } else {
      // Show old origin moving away
      drawArrow(ctx, origin.x, origin.y, rawOrigin.x + viewOffset.x, rawOrigin.y + viewOffset.y, "#e2e8f0", "-a", true);
    }

    // Subtraction vector: b - a
    if (!isChallengeMode) {
      drawArrow(ctx, renderPosA.x, renderPosA.y, renderPosB.x, renderPosB.y, "#f59e0b", "b - a (나의 시선)");
    } else {
      // 그리기 모드에서 현재 그리는 중이거나 마지막으로 완성된 벡터 표시
      if (drawingStart && drawingEnd) {
        const renderStart = isTranslated && drawingStart === posA ? origin : drawingStart;
        drawArrow(ctx, renderStart.x, renderStart.y, drawingEnd.x, drawingEnd.y, "#6366f1", "내가 그린 벡터");
      } else if (lastCompletedVector) {
        const renderStart = isTranslated && lastCompletedVector.start === posA ? origin : lastCompletedVector.start;
        drawArrow(ctx, renderStart.x, renderStart.y, lastCompletedVector.end.x, lastCompletedVector.end.y, "#6366f1", "완성된 벡터");
      }
    }

    // Draw Points
    const drawPoint = (p: Point, color: string, label: string, sub: string) => {
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = color + "80";
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(p.x, p.y, 14, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "white";
      ctx.font = "bold 13px Inter";
      ctx.textAlign = "center";
      ctx.fillText(label, p.x, p.y + 5);
      ctx.fillStyle = color;
      ctx.font = "bold 14px Inter";
      ctx.fillText(sub, p.x, p.y + 40);
      ctx.restore();
    };

    drawPoint(renderPosA, "#3b82f6", "A", isTranslated ? "나 (기준)" : "나 (A)");
    drawPoint(renderPosB, "#ef4444", "B", "친구 (B)");
    
    // Origin Label
    ctx.fillStyle = "#64748b";
    ctx.beginPath(); ctx.arc(origin.x, origin.y, 5, 0, Math.PI * 2); ctx.fill();
    ctx.font = "bold 15px Inter";
    ctx.fillText(isTranslated ? "A 시점 원점" : "관측소(O)", origin.x - 30, origin.y + 25);
  };

  useEffect(() => {
    draw();
  }, [posA, posB, isChallengeMode, isTranslated, drawingStart, drawingEnd, lastCompletedVector]);

  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    return { x, y };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isTranslated) return;
    const coords = getCanvasCoordinates(e);
    if (!coords) return;
    const { x, y } = coords;

    if (isChallengeMode) {
      if (!drawingStart) {
        // 첫 번째 클릭: 시작점 선택
        if (Math.hypot(x - posA.x, y - posA.y) < 25) {
          setDrawingStart(posA);
          setDrawingEnd(posA);
          setLastCompletedVector(null);
          setFeedback(null);
        } else if (Math.hypot(x - posB.x, y - posB.y) < 25) {
          setDrawingStart(posB);
          setDrawingEnd(posB);
          setLastCompletedVector(null);
          setFeedback(null);
        }
      } else {
        // 두 번째 클릭: 종점 선택 및 검증
        const distToA = Math.hypot(x - posA.x, y - posA.y);
        const distToB = Math.hypot(x - posB.x, y - posB.y);
        
        let finalEnd: Point | null = null;
        if (distToA < 30) finalEnd = posA;
        else if (distToB < 30) finalEnd = posB;
        else finalEnd = { x, y };

        if (drawingStart === posA && distToB < 30) {
          setFeedback({ msg: "정답! b - a는 A(관찰자)에서 B(대상)로 향하는 벡터입니다.", type: 'success' });
          setLastCompletedVector({ start: drawingStart, end: posB });
        } else if (drawingStart === posB && distToA < 30) {
          setFeedback({ msg: "이것은 a - b 입니다! 친구(B)가 나(A)를 바라보는 시점입니다.", type: 'info' });
          setLastCompletedVector({ start: drawingStart, end: posA });
        } else {
          setFeedback({ msg: "화살표를 점 A나 B에 정확히 연결해 보세요.", type: 'error' });
          setLastCompletedVector({ start: drawingStart, end: finalEnd });
        }
        setDrawingStart(null);
        setDrawingEnd(null);
      }
    } else {
      // 일반 모드: 드래그 이동
      if (Math.hypot(x - posA.x, y - posA.y) < 25) setDragging('A');
      else if (Math.hypot(x - posB.x, y - posB.y) < 25) setDragging('B');
    }
  };

  const [isOverPoint, setIsOverPoint] = useState(false);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCanvasCoordinates(e);
    if (!coords) return;
    const { x, y } = coords;

    const overA = Math.hypot(x - posA.x, y - posA.y) < 25;
    const overB = Math.hypot(x - posB.x, y - posB.y) < 25;
    setIsOverPoint(overA || overB);

    if (isChallengeMode && drawingStart) {
      setDrawingEnd({ x, y });
    } else if (dragging) {
      if (dragging === 'A') setPosA({ x, y });
      else setPosB({ x, y });
    }
  };

  const handleEnd = () => {
    setDragging(null);
  };

  return (
    <div className="space-y-6 relative overflow-hidden">
      {/* Background Watermark */}
      <div 
        className="absolute inset-x-0 top-60 h-[50%] pointer-events-none opacity-[0.05] flex items-center justify-center z-0"
        style={{ 
          backgroundImage: 'url("/logo.png")', 
          backgroundSize: 'contain', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="max-w-3xl mx-auto bg-amber-50 p-6 rounded-3xl border border-amber-100 shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-4 right-4 flex gap-2">
           <button 
             onClick={() => setIsTranslated(!isTranslated)}
             className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${isTranslated ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-200'}`}
           >
             {isTranslated ? '전체 시점으로 복귀' : '나(A)를 원점으로 이동'}
           </button>
           <button 
             onClick={() => {
               setIsChallengeMode(!isChallengeMode);
               setDrawingStart(null);
               setDrawingEnd(null);
               setLastCompletedVector(null);
               setFeedback(null);
             }}
             className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${isChallengeMode ? 'bg-amber-500 text-white' : 'bg-white text-amber-600 border border-amber-200'}`}
           >
             {isChallengeMode ? '실험 모드' : '그리기 챌린지'}
           </button>
        </div>
        <div className="inline-flex items-center gap-2 bg-amber-100 px-3 py-1 rounded-full text-amber-700 text-xs font-bold mb-4">
          <Eye size={14} /> 관찰자 시점 탐구
        </div>
        <h3 className="text-2xl font-bold text-amber-900 mb-2">카메라의 눈: 상대 벡터</h3>
        {isTranslated ? (
          <p className="text-blue-800 leading-relaxed max-w-xl mx-auto font-bold animate-pulse">
            ✨ 지금 당신은 (0,0)에 있습니다. <br/>
            기존의 원점(O)이 어떻게 이동했는지, 친구(B)는 어디에 있는지 확인하세요.
          </p>
        ) : isChallengeMode ? (
          <p className="text-amber-800 leading-relaxed max-w-xl mx-auto font-medium">
            🚩 <b>나(A)</b>의 입장에서 <b>친구(B)</b>를 바라보는 화살표를 직접 그려보세요! <br/>
            <span className="text-xs opacity-70">(점 A를 누르고, 이어서 점 B를 누르세요)</span>
          </p>
        ) : (
          <p className="text-amber-800/80 leading-relaxed max-w-xl mx-auto">
            관측소(O)에서 본 나와 친구의 위치가 다를 때, <br className="hidden md:block" />
            <b>'나(A)'가 '친구(B)'를 보았을 때</b>의 방향과 거리는 어떻게 표현될까요?
          </p>
        )}
      </div>

      <div className="flex flex-col items-center">
        <div className="relative group">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            onMouseLeave={() => { handleEnd(); setDrawingStart(null); }}
            style={{ 
              cursor: isTranslated ? 'not-allowed' : (dragging || (isChallengeMode && drawingStart) ? 'grabbing' : isOverPoint ? 'pointer' : 'default'),
              touchAction: 'none'
            }}
            className="w-full h-auto bg-white border border-slate-200 rounded-3xl shadow-2xl transition-shadow group-hover:shadow-indigo-100 mb-4"
          />
          
          {feedback && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className={`absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-xl border text-sm font-bold flex items-center gap-3 backdrop-blur-md ${
                feedback.type === 'success' ? 'bg-emerald-500/90 text-white border-emerald-400' : 
                feedback.type === 'info' ? 'bg-blue-500/90 text-white border-blue-400' :
                'bg-red-500/90 text-white border-red-400'
              }`}
            >
              {feedback.type === 'success' ? <Zap size={18} /> : <Info size={18} />}
              {feedback.msg}
            </motion.div>
          )}

          <div className="absolute top-4 left-6 flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200 text-[10px] font-bold text-slate-500 shadow-sm pointer-events-none uppercase tracking-tight">
            <MousePointer2 size={12} /> {isTranslated ? '관점 이동 중 (편집 불가)' : isChallengeMode ? '시작점과 종점을 차례로 클릭하세요' : '점 A, B를 드래그하여 위치 이동'}
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-500 mb-8">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>나의 위치 (a): ({Math.round(posA.x - 80)}, {Math.round(340 - posA.y)})</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>친구 위치 (b): ({Math.round(posB.x - 80)}, {Math.round(340 - posB.y)})</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>상대 벡터 (b - a): ({Math.round(posB.x - posA.x)}, {Math.round(posA.y - posB.y)})</span>
          </div>
        </div>

        {/* Enhanced Activity Section */}
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 pb-16">
          {/* Mission Lab */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-slate-800 font-bold mb-2">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <MousePointer2 size={20} />
              </div>
              <h4 className="text-lg">Step-by-Step 탐구 가이드</h4>
            </div>
            
            <div className="space-y-4">
              <div className="group p-4 bg-slate-50 hover:bg-amber-50 rounded-2xl border border-slate-100 hover:border-amber-200 transition-all cursor-default">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] bg-slate-200 group-hover:bg-amber-200 px-2 py-0.5 rounded-full font-bold text-slate-500 group-hover:text-amber-700">활동 01</span>
                  <span className="text-sm font-bold text-slate-800">관점의 이동 체험</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  우측 상단의 <b>'나(A)를 원점으로'</b>를 눌러보세요. b - a 벡터의 화살표 모양이나 크기가 변하나요? 왜 이렇게 보이는지 설명해봅시다.
                </p>
                <textarea 
                  placeholder="관찰 결과를 자유롭게 적어보세요..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-amber-500 outline-none resize-none h-16 font-sans"
                />
              </div>

              <div className="group p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all cursor-default">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] bg-slate-200 group-hover:bg-blue-200 px-2 py-0.5 rounded-full font-bold text-slate-500 group-hover:text-blue-700">활동 02</span>
                  <span className="text-sm font-bold text-slate-800">그리기 챌린지 완수</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  그리기 챌린지를 켜고 점 A에서 B로, 그리고 B에서 A로 화살표를 그어보세요. b - a와 a - b의 방향 차이는 무엇을 의미할까요?
                </p>
                <textarea 
                  placeholder="뺄셈의 순서에 따른 차이를 적어보세요..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none h-16 font-sans"
                />
              </div>

              <div className="group p-4 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all cursor-default">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] bg-slate-200 group-hover:bg-emerald-200 px-2 py-0.5 rounded-full font-bold text-slate-500 group-hover:text-emerald-700">활동 03</span>
                  <span className="text-sm font-bold text-slate-800">거리와 멀어짐</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  친구(B)가 나(A)로부터 멀어지는 방향으로 이동할 때, 상대 벡터의 크기(절댓값)는 어떻게 변화하나요?
                </p>
                <textarea 
                  placeholder="거리 변화와 벡터 크기의 관계를 적어보세요..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none resize-none h-16 font-sans"
                />
              </div>
            </div>
          </div>

          {/* Theory & Reflection Card */}
          <div className="flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-xl text-slate-300 relative overflow-hidden flex-1">
              <div className="absolute -top-10 -right-10 p-4 opacity-5 pointer-events-none">
                <Layers size={240} />
              </div>
              <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Zap size={20} className="text-amber-400" />
                관점의 이동 (Translation)
              </h4>
              <div className="space-y-6">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                  <h5 className="text-sm font-bold text-amber-400 mb-2 italic">Why Subtraction?</h5>
                  <p className="text-xs leading-relaxed text-slate-400">
                    벡터의 뺄셈 <b>b - a</b>는 기하학적으로 <b>"나(A)를 원점(0,0)으로 강제 이동시켰을 때, 세상이 어떻게 재편되는가"</b>를 보여주는 도구입니다. 
                    <br/><br/>
                    내가 움직이면 세상이 반대 방향으로 움직이는 것처럼 보이는 현상(상대 속도)이 바로 이 <b>-a</b>의 연산 과정입니다.
                  </p>
                </div>
                
                <div className="space-y-4">
                   <div className="flex items-start gap-3">
                     <div className="mt-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                     <p className="text-xs italic text-slate-400">"벡터 뺄셈은 타인의 위치에서 나의 존재를 지우고, 오직 '관계'만을 남기는 과정입니다."</p>
                   </div>
                   <div className="flex items-start gap-3">
                     <div className="mt-1 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                     <p className="text-xs italic text-slate-400">"카메라 렌즈(A)가 피사체(B)를 따라갈 때, 화면 중심에 피사체를 두는 행위가 바로 b - a = 0을 유지하려는 연산입니다."</p>
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 p-8 rounded-[2rem] shadow-lg shadow-blue-200 text-white">
              <h4 className="font-bold flex items-center gap-2 mb-3">
                <Brain size={20} />
                사고 확장 활동
              </h4>
              <p className="text-sm text-blue-50 leading-relaxed">
                만약 우리가 3차원 공간(드론의 시점)에 있다면, 상대 벡터를 구하는 공식은 어떻게 달라질까요? <br/>
                <b>(x2-x1, y2-y1, z2-z1)</b>로 확장되는 논리를 상상해보세요.
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
            <span className="text-sm font-display font-bold text-slate-800">제작자 : Gabriel Math (Gabriel Byeongje Jeon)</span>
          </div>
        </div>
        <span className="text-[10px] text-slate-300 font-mono text-right">Discover Math Laboratory © 2026</span>
      </div>
    </div>
  );
};
