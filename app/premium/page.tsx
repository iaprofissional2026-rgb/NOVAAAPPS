'use client';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CheckCircle2, Clock, Zap, Star, Gem, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { useAuth } from '@/components/AuthProvider';

const PLANS = [
  {
    id: 'iron',
    name: 'IRON',
    icon: <Zap size={24} className="text-slate-300" />,
    oldPrice: '147,90',
    price: '19,99',
    description: 'Para quem está dando os primeiros passos.',
    features: [
      'Acesso básico a Lições',
      'Missões Diárias Limitadas',
      'Acompanhamento de Perfil'
    ],
    link: 'https://pay.kiwify.com.br/jPLIlki',
    gradient: 'from-slate-400 to-slate-600',
    shadow: 'shadow-slate-500/20'
  },
  {
    id: 'gold',
    name: 'GOLD',
    badge: 'MELHOR OFERTA (BUG)',
    icon: <Star size={24} className="text-yellow-200" />,
    oldPrice: '247,90',
    price: '17,99', // As per user prompt, Gold is 17.99
    description: 'Plano superior promocional mais barato que o básico!',
    features: [
      'Tudo do plano Iron',
      'Áudios de Reprogramação',
      'Quizzes de Alta Retenção',
      'Suporte Prioritário VIP'
    ],
    link: 'https://pay.kiwify.com.br/gPgADJH',
    gradient: 'from-yellow-500 to-amber-600',
    shadow: 'shadow-yellow-500/30',
    featured: true
  },
  {
    id: 'diamante',
    name: 'DIAMANTE',
    icon: <Gem size={24} className="text-cyan-200" />,
    oldPrice: '497,90',
    price: '30,00',
    description: 'O arsenal completo para dominar sua mente.',
    features: [
      'Tudo do plano Gold',
      'Acesso Vitalício',
      'E-books & Guias Práticos',
      'Acesso a Comunidade Secreta'
    ],
    link: 'https://pay.kiwify.com.br/GV4SS13',
    gradient: 'from-cyan-400 to-blue-600',
    shadow: 'shadow-cyan-500/20'
  }
];

export default function PremiumUpgrade() {
  const router = useRouter();
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes fake timer

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCheckout = (url: string) => {
    // Append the user's UID to use Kiwify's SRC tracking parameter
    const finalUrl = user?.uid ? `${url}?src=${user.uid}` : url;
    window.open(finalUrl, '_blank');
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-transparent px-5 py-6 pb-20 relative overflow-x-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-20%] w-[120%] h-[40%] bg-gradient-to-br from-yellow-900/40 via-purple-900/20 to-transparent rounded-b-[100%] blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center mb-8 relative z-10">
        <button 
          onClick={() => router.back()}
          className="p-3 glass-card rounded-2xl mr-4 text-white hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Evolução Máxima</h1>
          <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mt-0.5">Planos Premium</p>
        </div>
      </header>

      {/* Scarcity Banner */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card border border-red-500/30 bg-red-500/10 rounded-2xl p-4 mb-8 flex items-center justify-between"
      >
        <div>
          <h2 className="text-red-400 font-bold text-[15px] flex items-center gap-1.5">
            <Clock size={16} />
            Oferta Encerra Em Breve
          </h2>
          <p className="text-white/70 text-xs mt-1">Os descontos de até 90% vão expirar.</p>
        </div>
        <div className="text-2xl font-black text-white font-mono bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
          {formatTime(timeLeft)}
        </div>
      </motion.div>

      {/* Plans */}
      <div className="space-y-6 relative z-10">
        {PLANS.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
            className={`glass-card rounded-[2rem] p-6 relative overflow-hidden backdrop-blur-md ${plan.featured ? 'border-2 border-yellow-500/50' : 'border border-white/10'}`}
          >
            {/* Background Gradient for Featured */}
            {plan.featured && (
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-600/5 pointer-events-none" />
            )}

            {plan.badge && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-black px-4 py-1.5 tracking-wider rounded-bl-2xl shadow-lg">
                {plan.badge}
              </div>
            )}

            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${plan.gradient} shadow-lg ${plan.shadow}`}>
                {plan.icon}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-md">{plan.name}</h3>
                <p className="text-white/60 text-xs font-medium">{plan.description}</p>
              </div>
            </div>

            <div className="mb-6 relative z-10">
              <div className="flex items-end gap-2">
                <span className="text-white/40 line-through text-lg font-medium">R$ {plan.oldPrice}</span>
                <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Desconto Ativo</span>
              </div>
              <div className="flex items-baseline mt-[-4px]">
                <span className="text-white font-bold text-xl mr-1">R$</span>
                <span className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">{plan.price}</span>
                <span className="text-white/60 ml-2 font-medium text-sm">/hoje</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 relative z-10">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center text-sm text-white/80 font-medium">
                  <CheckCircle2 size={18} className={`mr-3 flex-shrink-0 ${plan.featured ? 'text-yellow-400' : 'text-blue-400'}`} />
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleCheckout(plan.link)}
              className={`w-full relative overflow-hidden py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${plan.featured ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-yellow-500/30' : 'bg-white text-black'}`}
            >
              <ShieldCheck size={20} />
              Garantir Plano {plan.name}
            </button>
          </motion.div>
        ))}
      </div>
      
      <div className="text-center mt-10">
        <p className="text-white/40 text-xs flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} /> Compra 100% segura e garantida via Kiwify.
        </p>
      </div>
    </div>
  );
}
