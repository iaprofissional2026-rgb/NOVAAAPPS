'use client';
import { motion } from 'motion/react';
import { BrainCircuit, Star, Target, Zap, User } from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useApp } from '@/components/AppProvider';
import { useEffect } from 'react';

export default function DashboardHome() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const { config } = useApp();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="p-6 text-white/50 text-center mt-10">Carregando perfil...</div>;

  return (
    <div className="px-6 py-10">
      <header className="flex justify-between items-center mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-white/60 font-medium text-sm tracking-wide">Bem dia,</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">{profile?.displayName || 'Usuário'}</h1>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="w-12 h-12 rounded-full p-[1px] glass-card shadow-[0_0_15px_rgba(255,255,255,0.1)] relative overflow-hidden"
        >
          <div className="w-full h-full bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
        </motion.div>
      </header>

      {/* Daily Phrase */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 glass-card rounded-[2rem] border-l-4 border-primary"
      >
        <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-2">Foco do Dia</p>
        <p className="text-white/90 text-sm italic font-medium leading-relaxed">
          "{config?.dailyPhrase || 'A jornada de mil milhas começa com um único passo.'}"
        </p>
      </motion.div>

      {/* Hero Card */}
      <motion.div 
        whileTap={{ scale: 0.98 }}
        className="w-full glass-card rounded-[2rem] p-7 relative overflow-hidden mb-6"
      >
        <div className="relative z-10 flex flex-col">
          <span className="text-white/60 font-semibold text-xs mb-1 uppercase tracking-widest">Nível de Controle</span>
          <h2 className="text-3xl font-extrabold text-white mb-8 tracking-tight drop-shadow-md">Alta Performance</h2>
          
          <div className="w-full">
            <div className="flex justify-between text-white/80 text-sm font-semibold mb-3">
              <span className="opacity-90">Progresso do Nível</span>
              <span className="opacity-90">{profile?.xp || 0} / { (profile?.level || 1) * 500 } XP</span>
            </div>
            <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden backdrop-blur-sm relative">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${Math.min(100, ((profile?.xp || 0) / ((profile?.level || 1) * 500)) * 100)}%` }}
                 transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                 className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full absolute left-0 top-0" 
               />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Premium Upgrade Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={() => router.push('/premium')}
        className="mb-10 w-full glass-card rounded-3xl p-5 relative overflow-hidden cursor-pointer shadow-lg hover:shadow-yellow-500/20 hover:scale-[1.01] transition-all"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-yellow-400 to-amber-600 p-2.5 rounded-xl shadow-md">
              <Star className="text-white fill-white" size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-[15px] tracking-tight">Desbloqueie o Premium</h3>
              <p className="text-yellow-400/90 text-[11px] font-bold uppercase tracking-wider mt-0.5">Vagas Limitadas • 90% OFF</p>
            </div>
          </div>
          <div className="bg-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-white backdrop-blur-md">
            VER
          </div>
        </div>
      </motion.div>

      {/* Missão do Dia */}
      <div className="mb-8">
        <h3 className="text-[17px] font-bold text-white mb-4 flex items-center gap-2">
          Foco do Dia
        </h3>
        
        <div className="glass-card rounded-3xl p-5 flex items-center shadow-xl">
          <div className="bg-white/5 p-3.5 rounded-2xl mr-4 border border-white/5">
             <Zap className="text-purple-400" size={24} />
          </div>
          <div className="flex-1">
             <h4 className="text-white font-semibold text-[15px]">Meta: Foco Progressivo</h4>
             <p className="text-white/60 text-sm mt-1">{profile?.xp || 0} XP acumulados</p>
          </div>
          <button 
            onClick={() => router.push('/dashboard/missions')}
            className="bg-white text-black px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:translate-y-[-2px] transition-transform"
          >
            Missões
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card rounded-[2rem] p-6 shadow-lg">
           <div className="bg-white/5 w-fit p-3 rounded-2xl mb-4 border border-white/5">
             <BrainCircuit className="text-blue-400" size={24} />
           </div>
           <p className="text-white font-black text-2xl tracking-tight">{((profile?.level || 1) * 1.2 + (profile?.xp || 0) / 1000).toFixed(1)}</p>
           <p className="text-white/60 text-[11px] font-bold uppercase tracking-wider mt-1">IQ Estimado</p>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card rounded-[2rem] p-6 shadow-lg">
           <div className="bg-white/5 w-fit p-3 rounded-2xl mb-4 border border-white/5">
             <Target className="text-yellow-400" size={24} />
           </div>
           <p className="text-white font-black text-2xl tracking-tight">{profile?.level || 1}</p>
           <p className="text-white/60 text-[11px] font-bold uppercase tracking-wider mt-1">Nível Recurso</p>
        </motion.div>
      </div>
    </div>
  )
}
