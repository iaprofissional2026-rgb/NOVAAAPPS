'use client';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Brain, Trophy, Flame, LogIn } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export default function QuizResult() {
  const router = useRouter();
  const { user, signInWithGoogle } = useAuth();

  const handleAction = async () => {
    if (user) {
      router.push('/dashboard');
    } else {
      try {
        await signInWithGoogle();
        router.push('/dashboard');
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <ScreenWrapper className="h-[100dvh] bg-transparent px-6 py-12 flex flex-col relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full mt-6">
        <motion.div
           initial={{ scale: 0.5, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ type: 'spring', delay: 0.2, bounce: 0.5 }}
           className="relative flex items-center justify-center mb-8"
        >
          {/* Animated SVG Ring */}
          <svg width="180" height="180" className="transform -rotate-90">
             <circle cx="90" cy="90" r="80" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
             <motion.circle 
               cx="90" cy="90" r="80" fill="transparent" 
               stroke="url(#result-gradient)" strokeWidth="12"
               strokeDasharray={2 * Math.PI * 80}
               strokeLinecap="round"
               initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
               animate={{ strokeDashoffset: (2 * Math.PI * 80) * (1 - 0.35) }}
               transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
             />
             <defs>
               <linearGradient id="result-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#3B82F6" />
                 <stop offset="100%" stopColor="#8B5CF6" />
               </linearGradient>
             </defs>
          </svg>
          <div className="absolute flex flex-col items-center drop-shadow-md">
            <Brain size={28} className="text-white/60 mb-1" />
            <span className="text-2xl font-extrabold text-white">Nível 2</span>
          </div>
        </motion.div>

        <motion.div 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.8 }}
           className="text-center"
        >
          <h2 className="text-[12px] font-bold text-blue-400 uppercase tracking-widest mb-2">Diagnóstico Concluído</h2>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-3 tracking-tight">
            Consciência
          </h1>
          <p className="text-white/60 max-w-sm mx-auto mb-8 text-[14px] leading-relaxed">
            Você percebe o ritmo hipnótico, mas ainda luta contra a procrastinação. É hora de aplicar foco intencional.
          </p>
        </motion.div>
        
        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 1 }}
           className="w-full"
        >
          <div className="glass-card rounded-3xl p-5 w-full flex items-center justify-between mb-10 shadow-xl">
            <div className="flex items-center gap-4">
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <Trophy className="text-blue-400" size={20} />
                </div>
                <div>
                   <p className="text-white/80 font-medium text-xs">Potencial Vivo</p>
                   <p className="text-blue-400 text-base font-extrabold mt-0.5">35%</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <Flame className="text-purple-400" size={20} />
                </div>
                <div>
                   <p className="text-white/80 font-medium text-xs">Dias de Foco</p>
                   <p className="text-purple-400 text-base font-extrabold mt-0.5">0</p>
                </div>
            </div>
          </div>
        </motion.div>

        {!user && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
            className="w-full glass-card border-blue-500/20 bg-blue-500/5 p-5 rounded-[2rem] text-center mb-6"
          >
            <h3 className="text-white font-bold text-sm mb-1">Crie sua conta para salvar o progresso</h3>
            <p className="text-white/50 text-xs mb-0">Salve seus resultados e inicie sua jornada gratuitamente.</p>
          </motion.div>
        )}
      </div>
      
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="w-full z-10 pb-4"
      >
         <PremiumButton onClick={handleAction} className="bg-white text-black font-black flex items-center justify-center gap-2">
           {!user && <LogIn size={20} />}
           {user ? 'Acessar Dashboard' : 'Criar Conta com Google'}
         </PremiumButton>
      </motion.div>
    </ScreenWrapper>
  )
}
