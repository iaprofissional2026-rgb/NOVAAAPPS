'use client';
import { motion } from 'motion/react';
import { BookOpen, Lock, ChevronLeft, Download, FileText, Gem } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

const GUIDES = [
  { id: 1, title: 'O Protocolo da Disciplina Inabalável', category: 'Mindset', pages: 45 },
  { id: 2, title: 'Biohacking para Alta Performance', category: 'Saúde', pages: 32 },
  { id: 3, title: 'Manual de Engenharia Social e Influência', category: 'Social', pages: 28 },
  { id: 4, title: 'Construindo um Império Digital do Zero', category: 'Business', pages: 89 },
];

export default function GuidesPage() {
  const router = useRouter();
  const { profile } = useAuth();

  const isLocked = profile?.plan !== 'diamante';

  return (
    <div className="min-h-screen bg-[#050508] text-white p-6 pb-32">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={() => router.back()} className="p-3 glass-card rounded-2xl text-white/60">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Biblioteca Diamante</h1>
          <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">E-books e Protocolos</p>
        </div>
      </header>

      {isLocked ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mb-6 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <Lock size={32} className="text-cyan-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">Acesso Restrito</h2>
          <p className="text-white/40 text-sm mb-8 max-w-[280px]">
            Esta biblioteca de elite está disponível exclusivamente para membros do plano <span className="text-cyan-400 font-bold">DIAMANTE</span>.
          </p>
          <button 
            onClick={() => router.push('/premium')}
            className="bg-cyan-500 text-black font-black uppercase tracking-tight py-4 px-10 rounded-2xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <Gem size={20} />
            Upgrade para Diamante
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {GUIDES.map((guide, i) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-cyan-500/10 rounded-2xl text-cyan-400">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-1">{guide.category}</p>
                  <h3 className="text-sm font-bold text-white leading-tight">{guide.title}</h3>
                  <p className="text-[10px] text-white/20 mt-1 font-mono">{guide.pages} páginas • PDF</p>
                </div>
              </div>
              <button 
                onClick={() => alert("Fazendo download do protocolo...")}
                className="p-3 glass-card rounded-xl text-white/30 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all"
              >
                <Download size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
