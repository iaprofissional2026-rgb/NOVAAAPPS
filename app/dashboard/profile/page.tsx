'use client';
import { motion } from 'motion/react';
import { User, Settings, Award, Layers, LogOut, Star } from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useEffect } from 'react';

export default function DashboardProfile() {
  const router = useRouter();
  const { user, profile, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="p-6 text-white/50 text-center mt-10">Carregando perfil...</div>;

  return (
    <div className="px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold text-white tracking-tight">Evolução Pessoal</h1>
        <button className="p-3 glass-card rounded-2xl text-white/60 hover:text-white transition-colors shadow-sm">
          <Settings size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center mb-12">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative mb-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-xl opacity-40 transform translate-y-2" />
          <div className="relative w-32 h-32 glass-card rounded-[2.5rem] flex items-center justify-center shadow-2xl overflow-hidden p-1">
             <div className="w-full h-full rounded-[2.2rem] bg-gradient-to-tr from-blue-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden">
               {user.photoURL ? (
                 <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
               ) : (
                 <User size={60} className="text-white/80" strokeWidth={1.5} />
               )}
             </div>
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-black min-w-[80px] text-center uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-purple-500/30">
             Nível {profile?.level || 1}
          </div>
        </motion.div>
        
        {/* User Badges */}
        <div className="flex items-center gap-2 mb-2 mt-4">
           {profile?.plan !== 'free' && (
             <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-shadow-sm shadow-md
               ${profile?.plan === 'diamante' ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white' : 
                 profile?.plan === 'gold' ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black' : 
                 'bg-gradient-to-r from-slate-400 to-slate-600 text-white'}`}
             >
               Membro {profile?.plan}
             </span>
           )}
        </div>

        <motion.h2 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-2xl font-bold text-white tracking-tight">{profile?.displayName || 'Usuário'}</motion.h2>
        <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-white/60 font-medium text-sm mt-1">{user.email}</motion.p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
         <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-[2rem] flex flex-col items-center text-center shadow-xl">
            <div className="bg-white/5 p-3 rounded-2xl mb-3 border border-white/5">
              <Award className="text-blue-400" size={28} />
            </div>
            <span className="text-3xl font-black text-white tracking-tight">{profile?.level || 1}</span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/60 mt-1">Conquistas</span>
         </motion.div>
         <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-6 rounded-[2rem] flex flex-col items-center text-center shadow-xl">
            <div className="bg-white/5 p-3 rounded-2xl mb-3 border border-white/5">
              <Layers className="text-purple-400" size={28} />
            </div>
            <span className="text-3xl font-black text-white tracking-tight">{profile?.xp || 0}</span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/60 mt-1">Total XP</span>
         </motion.div>
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card rounded-[2rem] p-7 shadow-lg mb-8">
        <h3 className="text-white font-bold mb-6 tracking-tight">Evolução da Semana</h3>
        <div className="h-32 flex items-end justify-between gap-3">
           {[30, 45, 25, 60, 40, 80, 50].map((h, i) => (
             <motion.div 
               key={i}
               initial={{ height: 0 }}
               animate={{ height: `${h}%` }}
               transition={{ duration: 1, delay: 0.5 + (i * 0.1), ease: 'easeOut' }}
               className={`w-full rounded-lg ${i === 5 ? 'bg-gradient-to-t from-blue-500 to-purple-500' : 'bg-white/5'}`}
             />
           ))}
        </div>
        <div className="flex justify-between mt-4 px-1 text-[11px] font-bold tracking-widest uppercase text-white/60">
          <span>Seg</span>
          <span>Dom</span>
        </div>
      </motion.div>
      
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="mb-10">
        <PremiumButton 
           onClick={() => router.push('/premium')}
           className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black shadow-yellow-500/20 font-black tracking-tight"
        >
          <Star className="text-white fill-white mr-2" size={18} />
          <span className="text-white drop-shadow-md">EvoMind Premium</span>
        </PremiumButton>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8">
        <PremiumButton 
           variant="outline" 
           onClick={() => logout()}
           className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 font-bold"
        >
          <LogOut size={20} className="mr-1" />
          Sair da Conta
        </PremiumButton>
      </motion.div>
    </div>
  )
}
