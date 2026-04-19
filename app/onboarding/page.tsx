'use client';
import { useState } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { BrainCircuit, Compass, Zap } from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';

const slides = [
  {
    id: 1,
    title: 'Descubra Seu Nível',
    description: 'Avalie sua disciplina, foco e identifique barreiras invisíveis em sua mentalidade.',
    icon: BrainCircuit,
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 2,
    title: 'Plano Personalizado',
    description: 'Acesse roteiros baseados no seu resultado para derrotar a procrastinação.',
    icon: Compass,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 3,
    title: 'Evolua Todos os Dias',
    description: 'Cumpra missões diárias e acompanhe sua ascensão para a alta performance.',
    icon: Zap,
    color: 'from-purple-500 to-pink-500'
  }
];

export default function Onboarding() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  const nextSlide = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      router.push('/quiz');
    }
  };

  const isLast = current === slides.length - 1;

  return (
    <div className="h-[100dvh] flex flex-col bg-transparent px-6 py-12 relative overflow-hidden">
      {/* Background glow based on current slide */}
      <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${slides[current]?.color || 'from-blue-500 to-purple-500'} rounded-full blur-[120px] opacity-10 transition-all duration-700 ease-in-out transform translate-x-1/3 -translate-y-1/3`} />
      
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait">
          {slides[current] && (
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center mt-[-80px]"
            >
              <div className="relative mb-12">
                <div className={`absolute inset-0 bg-gradient-to-br ${slides[current].color} blur-2xl opacity-40 rounded-full`} />
                <div className="relative glass-card p-8 rounded-[3rem] shadow-2xl flex items-center justify-center">
                  {React.createElement(slides[current].icon, { 
                    size: 80, 
                    className: "text-[#FFFFFF] drop-shadow-md",
                    strokeWidth: 1.5
                  })}
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                {slides[current].title}
              </h2>
              <p className="text-white/60 text-lg leading-relaxed max-w-[280px]">
                {slides[current].description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full flex justify-center gap-2 mb-10 z-10">
        {slides.map((_, idx) => (
          <motion.div
            key={idx}
            className={`h-1.5 rounded-full ${current === idx ? 'bg-white w-8' : 'bg-white/20 w-3'}`}
            layoutId={current === idx ? 'active-indicator' : undefined}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        ))}
      </div>

      <div className="w-full z-10 mb-2">
        <PremiumButton onClick={nextSlide}>
          {isLast ? 'Começar Jornada' : 'Continuar'}
        </PremiumButton>
      </div>

      <div className="w-full z-10 flex justify-center pb-2">
        <button 
          onClick={() => router.push('/login')}
          className="text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
        >
          Já tenho uma conta
        </button>
      </div>
    </div>
  );
}
