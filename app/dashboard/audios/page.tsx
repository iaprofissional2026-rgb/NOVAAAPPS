'use client';
import { motion } from 'motion/react';
import { Music, Lock, Play, Pause, ChevronLeft, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

const AUDIOS = [
  { id: 1, title: 'Reprogramação de Foco Matinal', duration: '12:45', plan: 'gold' },
  { id: 2, title: 'Superando o Medo do Fracasso', duration: '15:20', plan: 'gold' },
  { id: 3, title: 'Visualização de Sucesso Extremo', duration: '10:10', plan: 'gold' },
  { id: 4, title: 'Indução ao Sono Profundo e Criativo', duration: '20:00', plan: 'diamante' },
  { id: 5, title: 'Mindset de Inabalável', duration: '18:30', plan: 'diamante' },
];

export default function AudiosPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [playing, setPlaying] = useState<number | null>(null);

  const planRank: Record<string, number> = {
    'free': 0,
    'iron': 1,
    'gold': 2,
    'diamante': 3
  };

  const isLocked = (audioPlan: string) => {
    const userRank = planRank[profile?.plan || 'free'];
    const requiredRank = planRank[audioPlan];
    return userRank < requiredRank;
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white p-6 pb-32">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={() => router.back()} className="p-3 glass-card rounded-2xl text-white/60">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Áudios de Poder</h1>
          <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Reprogramação Mental</p>
        </div>
      </header>

      <div className="space-y-4">
        {AUDIOS.map((audio) => {
          const locked = isLocked(audio.plan);
          const isPlaying = playing === audio.id;

          return (
            <motion.div
              key={audio.id}
              onClick={() => {
                if (locked) return router.push('/premium');
                setPlaying(isPlaying ? null : audio.id);
              }}
              className={`glass-card p-5 rounded-3xl border border-white/5 flex items-center justify-between transition-all ${locked ? 'opacity-50' : 'hover:bg-white/5 active:scale-95 cursor-pointer'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${isPlaying ? 'bg-primary text-white shadow-lg shadow-primary/20 animate-pulse' : 'bg-white/5 text-white/40'}`}>
                  <Music size={20} />
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${locked ? 'text-white/40' : 'text-white'}`}>{audio.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-white/20 font-mono">{audio.duration}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest ${audio.plan === 'diamante' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-yellow-500/20 text-yellow-500'}`}>
                      {audio.plan}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                {locked ? (
                  <Lock size={18} className="text-white/20" />
                ) : isPlaying ? (
                  <Pause size={18} className="text-primary" />
                ) : (
                  <Play size={18} className="text-white/40 group-hover:text-primary transition-colors" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {playing && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[360px] glass-card p-4 rounded-3xl border border-primary/20 z-50 flex items-center gap-4"
        >
          <div className="p-2 bg-primary/20 rounded-xl text-primary animate-spin">
            <Music size={16} />
          </div>
          <div className="flex-1 overflow-hidden">
             <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Reproduzindo</p>
             <p className="text-xs font-bold text-white truncate">{AUDIOS.find(a => a.id === playing)?.title}</p>
          </div>
          <button onClick={() => setPlaying(null)} className="p-2 text-white/40">
             <Pause size={20} />
          </button>
        </motion.div>
      )}
    </div>
  );
}
