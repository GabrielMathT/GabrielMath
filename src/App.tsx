import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivityType } from './types';
import { Activity1 } from './components/Activity1';
import { Activity2 } from './components/Activity2';
import { Activity3 } from './components/Activity3';
import { Compass, Camera, Layers, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActivityType>(ActivityType.LINEAR_COMBINATION);

  const tabs = [
    { id: ActivityType.LINEAR_COMBINATION, label: '벡터 조각보', icon: Compass, description: '선형 결합과 항로 설계' },
    { id: ActivityType.SUBTRACTION, label: '카메라의 눈', icon: Camera, description: '벡터의 뺄셈과 상대 위치' },
    { id: ActivityType.EQUILIBRIUM, label: '힘의 평형', icon: Zap, description: '벡터의 합과 물리적 평형' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* Top Left Branding */}
      <div className="absolute top-6 left-6 z-[100]">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="w-12 h-12 object-contain drop-shadow-sm"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      </div>

      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-slate-900 mb-4 leading-tight">
          변화의 경로
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
          세상을 움직이는 물리적인 힘과 추상적인 공간을 화살표 하나로 연결합니다. 
          연산을 통해 단순히 결과를 얻는 것을 넘어, 시스템의 미래를 제어하고 균형을 설계하는 과정을 경험해보세요.
        </p>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200 mb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-around items-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-6 px-4 flex flex-col items-center gap-2 group transition-all ${
                  activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <tab.icon 
                  size={20} 
                  className={`transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'}`} 
                />
                <span className="text-xs font-bold tracking-tight">{tab.label}</span>
                
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="min-h-[500px]"
          >
            {activeTab === ActivityType.LINEAR_COMBINATION && <Activity1 />}
            {activeTab === ActivityType.SUBTRACTION && <Activity2 />}
            {activeTab === ActivityType.EQUILIBRIUM && <Activity3 />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Watermark & Credits */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end opacity-80 pointer-events-none select-none text-right group hover:opacity-100 transition-opacity">
        <div className="bg-white/40 backdrop-blur-md p-4 rounded-3xl border border-white/20 flex items-center gap-4 shadow-xl">
           <img 
             src="/logo.png" 
             alt="" 
             className="w-16 h-16 md:w-20 md:h-20 object-contain" 
             onError={(e) => (e.currentTarget.style.display = 'none')}
           />
           <div className="flex flex-col">
             <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">
               제작자
             </span>
             <span className="text-xs md:text-sm font-display font-bold text-slate-800 whitespace-nowrap">
               Gabriel Math (Gabriel Byeongje Jeon)
             </span>
           </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 py-16 px-6 border-t border-slate-800 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center gap-8 text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]">
            <span>Vector Calculus</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-1"></span>
            <span>Applied Physics</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-1"></span>
            <span>Navigation Design</span>
          </div>
          <p className="text-slate-400 text-sm italic font-display">
            "우리가 긋는 한 줄의 화살표에는 세상을 움직이는 논리가 담겨 있습니다."
          </p>
          <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-none">
              © 2026 Gabriel Math · Discover Math Laboratory
            </span>
            <div className="flex gap-4">
               {['#Linear', '#Balance', '#Prediction'].map(tag => (
                 <span key={tag} className="text-[10px] font-mono text-slate-700 hover:text-blue-500 transition-colors cursor-default">
                   {tag}
                 </span>
               ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
