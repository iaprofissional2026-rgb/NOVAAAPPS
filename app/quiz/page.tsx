'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { ChevronLeft } from 'lucide-react';

const questions = [
  {
    id: 1,
    title: 'Disciplina',
    text: 'Com que frequência você cumpre o que promete a si mesmo, mesmo sem motivação?',
    options: ['Sempre, sou focado', 'Na maioria das vezes', 'Raramente, procrastino', 'Nunca, abandono logo']
  },
  {
    id: 2,
    title: 'Foco e Atenção',
    text: 'Quando você decide trabalhar em algo importante, por quanto tempo consegue focar sem olhar o celular?',
    options: ['Mais de 1 hora', 'Cerca de 30 minutos', 'Uns 10 minutos', 'Me distraio a cada minuto']
  },
  {
    id: 3,
    title: 'Ritmo Hipnótico',
    text: 'Você sente que vive no "piloto automático", repetindo os mesmos erros e rotinas ruins?',
    options: ['Não, possuo pleno controle', 'Às vezes me percebo assim', 'Muitas vezes, é difícil sair', 'Sempre, não consigo mudar']
  },
  {
    id: 4,
    title: 'Propósito Definito',
    text: 'O quão claro está o seu objetivo principal (seu propósito) de vida hoje?',
    options: ['Extremamente claro', 'Tenho uma boa ideia', 'Ainda muito confuso', 'Zero clareza, estou à deriva']
  },
  {
    id: 5,
    title: 'Medo e Insegurança',
    text: 'Como o medo de falhar afeta as suas decisões e novos projetos?',
    options: ['Uso o medo como combustível', 'Afeta pouco, sigo em frente', 'Me paralisa bastante', 'Desisto antes de começar']
  }
];

export default function QuizDiagnostic() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const router = useRouter();

  const handleSelect = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
    
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(curr => curr + 1);
      } else {
        router.push('/quiz/result');
      }
    }, 400);
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const currentQ = questions[currentIndex] || questions[0];

  return (
    <ScreenWrapper className="h-[100dvh] bg-transparent flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-4 px-6 flex items-center justify-between">
        <button 
          onClick={() => { if(currentIndex > 0) setCurrentIndex(currentIndex - 1); else router.back(); }}
          className="p-2 glass-card rounded-xl text-white/60 hover:text-white transition-colors border-0"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-white/50 font-medium text-[10px] tracking-widest uppercase">
            Diagnóstico {currentIndex + 1}/{questions.length}
          </span>
          {currentIndex === 0 && (
            <button 
              onClick={() => router.push('/login')}
              className="mt-1 text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors"
            >
              Já tenho uma conta
            </button>
          )}
        </div>
        <div className="w-10" />
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-8 mt-2">
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="flex-1 px-6 flex flex-col">
        <AnimatePresence mode="wait">
          {currentQ && (
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col"
            >
              <div className="mb-10">
                <h2 className="text-blue-400 font-semibold tracking-wider text-sm uppercase mb-3 drop-shadow-md">
                  {currentQ.title}
                </h2>
                <h3 className="text-[26px] font-bold text-white leading-snug">
                  {currentQ.text}
                </h3>
              </div>

              <div className="flex flex-col space-y-4">
                {currentQ.options.map((option, idx) => {
                  const isSelected = answers[currentIndex] === idx;
                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(idx)}
                      className={`w-full p-5 rounded-2xl text-left border transition-all duration-300 relative overflow-hidden ${
                        isSelected 
                          ? 'bg-purple-500/20 border-purple-500 shadow-[0_0_20px_rgba(139,92,246,0.2)]' 
                          : 'glass-card text-white hover:border-white/20'
                      }`}
                    >
                      {isSelected && (
                        <motion.div 
                          layoutId="quiz-selection"
                          className="absolute inset-0 bg-purple-500/10 pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                      <span className={`text-[15px] font-medium block relative z-10 ${isSelected ? 'text-white' : 'text-white/80'}`}>
                        {option}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScreenWrapper>
  );
}
