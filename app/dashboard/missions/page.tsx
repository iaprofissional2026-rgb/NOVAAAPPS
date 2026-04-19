'use client';
import { motion } from 'motion/react';
import { CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

const mockMissions = [
  { id: 1, title: 'Foco Profundo', desc: 'Trabalhe 30 minutos ininterruptos.', xp: 50, done: false },
  { id: 2, title: 'Bloquear Distrações', desc: 'Mantenha o celular em outro cômodo.', xp: 30, done: false },
  { id: 3, title: 'Leitura Edificante', desc: 'Leia 10 páginas sobre desenvolvimento mental.', xp: 40, done: false },
  { id: 4, title: 'Meditação Guiada', desc: '5 minutos apenas focando na respiração.', xp: 20, done: false }
];

export default function DashboardMissions() {
  const [missions, setMissions] = useState(mockMissions);
  const { incrementXP } = useAuth();

  const toggle = async (id: number) => {
    const mission = missions.find(m => m.id === id);
    if (!mission) return;
    
    if (!mission.done) {
      await incrementXP(mission.xp);
    }

    setMissions(missions.map(m => m.id === id ? { ...m, done: !m.done } : m));
  };

  return (
    <div className="px-6 py-10 pb-24">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Missões</h1>
        <p className="text-white/60 text-[15px] leading-relaxed">Cumpra suas tarefas diárias para quebrar o ritmo hipnótico e ganhar XP.</p>
      </motion.div>

      <div className="space-y-4">
        {missions.map((mission, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={mission.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggle(mission.id)}
            className={`cursor-pointer p-6 rounded-[2rem] border transition-all duration-300 shadow-lg relative overflow-hidden ${
              mission.done 
                ? 'bg-purple-500/10 border border-purple-500/30' 
                : 'glass-card'
            }`}
          >
             {mission.done && (
               <motion.div 
                 layoutId={`done-bg-${mission.id}`}
                 className="absolute inset-0 bg-purple-500/5 pointer-events-none" 
               />
             )}
             <div className="flex items-start gap-4 relative z-10">
               <div className="mt-0.5">
                 {mission.done ? (
                   <CheckCircle2 className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" size={26} strokeWidth={2.5} />
                 ) : (
                   <div className="w-[26px] h-[26px] border-[2px] border-white/20 rounded-md"></div>
                 )}
               </div>
               <div className="flex-1">
                 <h3 className={`font-semibold text-[16px] tracking-tight ${mission.done ? 'text-purple-200 line-through opacity-60' : 'text-white'}`}>
                   {mission.title}
                 </h3>
                 <p className={`text-[14px] mt-1.5 leading-snug ${mission.done ? 'text-purple-400/40' : 'text-white/50'}`}>
                   {mission.desc}
                 </p>
               </div>
               <div className={`px-3 py-1.5 rounded-xl border ${mission.done ? 'bg-purple-900/30 border-purple-500/20' : 'bg-white/5 border-white/10'}`}>
                 <span className={`text-[11px] font-bold tracking-widest uppercase ${mission.done ? 'text-purple-400' : 'text-blue-400'}`}>+{mission.xp} XP</span>
               </div>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
