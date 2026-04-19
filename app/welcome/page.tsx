'use client';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { EvoMindLogo } from '@/components/EvoMindLogo';
import { LogIn, UserPlus } from 'lucide-react';

export default function Welcome() {
  const router = useRouter();

  return (
    <ScreenWrapper className="h-[100dvh] bg-[#050508] px-6 py-12 flex flex-col justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-20%] w-[120%] h-[50%] bg-gradient-to-br from-blue-900/20 to-purple-900/10 rounded-b-[100%] blur-3xl opacity-50 pointer-events-none" />
      
      <div className="z-10 flex flex-col items-center w-full max-w-sm mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <EvoMindLogo className="w-40 h-32 drop-shadow-[0_0_25px_rgba(59,130,246,0.3)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-black text-white tracking-tight mb-4 uppercase">EvoMind</h1>
          <p className="text-white/40 text-sm font-bold uppercase tracking-[0.2em]">O Próximo Nível da sua Mente</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full space-y-4"
        >
          <PremiumButton 
            onClick={() => router.push('/login')}
            className="bg-white text-black font-black uppercase py-5 flex items-center justify-center gap-3"
          >
            <LogIn size={20} />
            Entrar na minha conta
          </PremiumButton>

          <PremiumButton 
            variant="ghost"
            onClick={() => router.push('/onboarding')}
            className="text-white/80 border-white/10 hover:border-white/20 font-black uppercase py-5 flex items-center justify-center gap-3 backdrop-blur-sm"
          >
            <UserPlus size={20} />
            Novo por aqui? Criar Conta
          </PremiumButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-[10px] text-white/20 font-black tracking-widest uppercase text-center"
        >
          Inicie sua jornada para a alta performance
        </motion.p>
      </div>
    </ScreenWrapper>
  );
}
