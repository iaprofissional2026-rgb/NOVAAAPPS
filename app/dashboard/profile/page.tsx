'use client';
import { motion } from 'motion/react';
import { User, Shield, Star, Gem, LogOut, ChevronLeft, Zap, Users, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useApp } from '@/components/AppProvider';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const { isMusicEnabled, toggleMusic } = useApp();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  const getPlanBadge = () => {
    switch (profile?.plan) {
      case 'diamante': return { label: 'DIAMANTE', icon: Gem, color: 'text-cyan-400', bg: 'bg-cyan-500/10' };
      case 'gold': return { label: 'GOLD', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
      case 'iron': return { label: 'IRON', icon: Zap, color: 'text-slate-400', bg: 'bg-slate-500/10' };
      default: return { label: 'FREE', icon: User, color: 'text-white/40', bg: 'bg-white/5' };
    }
  };

  const badge = getPlanBadge();

  if (loading || !user) return <div className="p-6 text-white/50 text-center mt-10">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#050508] text-white p-6 pb-32">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={() => router.back()} className="p-3 glass-card rounded-2xl text-white/60">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Seu Perfil</h1>
          <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Membro EvoMind</p>
        </div>
      </header>

      <div className="flex flex-col items-center mb-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-accent relative mb-4 shadow-2xl shadow-primary/20"
        >
          <div className="w-full h-full rounded-full bg-[#050508] flex items-center justify-center overflow-hidden">
             <User size={40} className="text-white/20" />
          </div>
          <div className={`absolute -bottom-1 -right-1 p-2 rounded-xl ${badge.bg} border border-white/10 shadow-lg`}>
             <badge.icon size={16} className={badge.color} />
          </div>
        </motion.div>
        
        <h2 className="text-2xl font-black tracking-tight">{profile?.displayName || 'Perfil'}</h2>
        <p className="text-white/40 text-xs font-mono mt-1">@{profile?.username || 'cadastrando...'}</p>

        <div className={`mt-4 px-4 py-1.5 rounded-full ${badge.bg} border border-white/10 flex items-center gap-2`}>
           <badge.icon size={14} className={badge.color} />
           <span className={`text-[10px] font-black uppercase tracking-widest ${badge.color}`}>{badge.label}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="glass-card p-6 rounded-[2rem] border border-white/5">
           <div className="flex justify-between items-center mb-6">
              <p className="text-xs font-black uppercase tracking-widest text-white/40">Sua Jornada</p>
              <span className="text-xs font-bold text-primary">Nível {profile?.level || 1}</span>
           </div>
           
           <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                   <span>Progresso Global</span>
                   <span>{profile?.xp || 0} XP</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-primary" style={{ width: `${Math.min(100, ((profile?.xp || 0) / 5000) * 100)}%` }} />
                </div>
              </div>
           </div>

           <div className="h-[1px] w-full bg-white/5 my-6" />

           <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-6">Configurações</p>
           <button 
             onClick={toggleMusic}
             className="w-full flex items-center justify-between group"
           >
              <div className="flex items-center gap-4">
                 <div className={`p-3 rounded-xl transition-all ${isMusicEnabled ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-white/40'}`}>
                    {isMusicEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                 </div>
                 <div className="text-left">
                    <p className="text-sm font-bold text-white">Música de Fundo</p>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">{isMusicEnabled ? 'Ativada' : 'Desativada'}</p>
                 </div>
              </div>
              <div className={`w-10 h-6 rounded-full relative transition-all ${isMusicEnabled ? 'bg-blue-500' : 'bg-white/10'}`}>
                 <motion.div 
                   animate={{ x: isMusicEnabled ? 18 : 2 }}
                   transition={{ type: "spring", stiffness: 500, damping: 30 }}
                   className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
                 />
              </div>
           </button>
        </div>

        {profile?.plan === 'diamante' && (
          <button 
            onClick={() => alert("Entrando na comunidade secreta...")}
            className="w-full glass-card p-5 rounded-2xl border border-cyan-500/30 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                <Users size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">Comunidade Secreta</p>
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Acesso Exclusivo</p>
              </div>
            </div>
            <Shield className="text-cyan-500" size={18} />
          </button>
        )}

        <button 
          onClick={handleLogout}
          className="w-full p-5 bg-red-500/5 text-red-500 rounded-2xl border border-red-500/20 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"
        >
          <LogOut size={18} />
          Sair da Conta
        </button>
      </div>
    </div>
  );
}
