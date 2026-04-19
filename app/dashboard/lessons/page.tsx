'use client';
import { motion } from 'motion/react';
import { BookOpen, Play, Clock, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

const lessons = [
  {
    id: 1,
    title: 'O Ritmo Hipnótico',
    duration: '12 min',
    desc: 'Como a repetição inconsciente trava sua evolução.',
    category: 'Mentalidade',
    premium: false
  },
  {
    id: 2,
    title: 'Escravidão do Hábito',
    duration: '15 min',
    desc: 'Identificando os elos que prendem sua rotina.',
    category: 'Disciplina',
    premium: false
  },
  {
    id: 3,
    title: 'Foco Inabalável',
    duration: '10 min',
    desc: 'Técnicas de exclusão para produtividade máxima.',
    category: 'Performance',
    premium: true
  },
  {
    id: 4,
    title: 'Reprogramação Ativa',
    duration: '20 min',
    desc: 'O método para reescrever suas crenças centrais.',
    category: 'Deep Work',
    premium: true
  }
];

export default function LessonsPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const isPremium = profile?.plan !== 'free';

  return (
    <div className="px-6 py-10 pb-24">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Lições</h1>
        <p className="text-white/60 text-[15px] leading-relaxed">Conhecimento profundo para libertar sua mente do automático.</p>
      </motion.div>

      <div className="space-y-6">
        {lessons.map((lesson, idx) => {
          const locked = lesson.premium && !isPremium;
          
          return (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={lesson.id}
              className={`p-6 rounded-[2.5rem] border transition-all duration-300 relative overflow-hidden group ${
                locked ? 'bg-white/5 border-white/5 opacity-70' : 'glass-card'
              }`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    locked ? 'bg-white/10 text-white/40' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {lesson.category}
                  </span>
                  {lesson.premium && (
                    <div className="flex items-center gap-1.5 bg-yellow-500/20 px-2 py-1 rounded-lg">
                      <Lock size={12} className="text-yellow-500" />
                      <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Premium</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-white/50 text-sm mt-1.5 leading-snug">
                    {lesson.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 text-white/40">
                    <Clock size={14} />
                    <span className="text-xs font-medium">{lesson.duration}</span>
                  </div>
                  
                  {locked ? (
                    <button 
                      onClick={() => router.push('/premium')}
                      className="bg-yellow-500/20 text-yellow-500 px-4 py-2 rounded-xl text-xs font-bold border border-yellow-500/30"
                    >
                      Desbloquear
                    </button>
                  ) : (
                    <button className="bg-white text-black p-2.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all">
                      <Play size={18} fill="currentColor" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
