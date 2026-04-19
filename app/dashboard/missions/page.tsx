'use client';
import { motion } from 'motion/react';
import { Target, Zap, ChevronLeft, Lock, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '@/components/AuthProvider';

export default function MissionsPage() {
  const router = useRouter();
  const { profile, incrementXP } = useAuth();
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'missions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const planRank: Record<string, number> = {
    'free': 0,
    'iron': 1,
    'gold': 2,
    'diamante': 3
  };

  const isLocked = (missionPlan: string) => {
    const userRank = planRank[profile?.plan || 'free'];
    const requiredRank = planRank[missionPlan || 'free'];
    return userRank < requiredRank;
  };

  const handleComplete = async (mission: any) => {
    if (isLocked(mission.planRequired)) {
      router.push('/premium');
      return;
    }
    // Simple completion logic for demo - in real app we'd track this in DB
    await incrementXP(mission.xpReward);
    alert(`Missão "${mission.title}" concluída! +${mission.xpReward} XP`);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white p-6 pb-20">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-3 glass-card rounded-2xl text-white/60">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Missões de Elite</h1>
          <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Evolução Progressiva</p>
        </div>
      </header>

      {loading ? (
        <div className="text-center py-20 text-white/20 uppercase font-black tracking-widest">Carregando missões...</div>
      ) : (
        <div className="space-y-4">
          {missions.map((mission, i) => {
            const locked = isLocked(mission.planRequired);
            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleComplete(mission)}
                className={`glass-card p-6 rounded-[2rem] border border-white/5 relative group cursor-pointer transition-all ${locked ? 'opacity-60 grayscale-[0.5]' : 'hover:scale-[1.02] active:scale-95'}`}
              >
                {locked && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-[2rem] flex items-center justify-center z-10">
                    <div className="bg-black/60 p-4 rounded-2xl flex flex-col items-center gap-2 border border-white/10">
                      <Lock size={20} className="text-yellow-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Plano {mission.planRequired} Necessário</span>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${locked ? 'bg-white/5 text-white/20' : 'bg-blue-500/10 text-blue-400'}`}>
                    <Target size={24} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest py-1 px-2 glass-card rounded-lg border border-white/5 mb-2">
                       {mission.planRequired}
                    </span>
                    <div className="flex items-center gap-1.5 text-blue-400">
                      <Zap size={14} className="fill-blue-400" />
                      <span className="text-xs font-black uppercase tracking-widest">+{mission.xpReward} XP</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{mission.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{mission.description}</p>
                
                <div className="mt-6 flex items-center justify-between">
                   <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-[#050508] bg-white/5 flex items-center justify-center overflow-hidden">
                           <div className="w-full h-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20" />
                        </div>
                      ))}
                      <span className="text-[10px] text-white/40 ml-4 self-center font-bold">124 pessoas focando</span>
                   </div>
                   {!locked && (
                     <CheckCircle2 size={24} className="text-white/10 group-hover:text-green-500 transition-colors" />
                   )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
