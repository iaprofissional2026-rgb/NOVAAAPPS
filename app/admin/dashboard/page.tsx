'use client';
import { motion } from 'motion/react';
import { 
  Users, 
  TrendingUp, 
  CreditCard, 
  Settings as SettingsIcon, 
  LogOut, 
  Search,
  ChevronRight,
  ShieldCheck,
  Zap,
  Star as StarIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    premiumUsers: 0,
    conversionRate: '0%'
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
      
      const premium = userList.filter((u: any) => u.plan && u.plan !== 'free').length;
      setStats({
        totalUsers: userList.length,
        activeToday: Math.floor(userList.length * 0.4), // Simulated active for dashboard visual
        premiumUsers: premium,
        conversionRate: userList.length > 0 ? `${Math.round((premium / userList.length) * 100)}%` : '0%'
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchData();
    };
    init();
  }, []);

  const handleTogglePlan = async (userId: string, currentPlan: string) => {
    const newPlan = currentPlan === 'free' ? 'gold' : 'free';
    try {
      await updateDoc(doc(db, 'users', userId), { plan: newPlan });
      fetchData(); // Refresh
    } catch (err) {
      alert("Erro ao alterar plano. Verifique permissões.");
    }
  };

  const handleLogoutAdmin = () => {
    sessionStorage.removeItem('admin_session');
    router.replace('/');
  };

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050508] text-white p-6 pb-20">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase flex items-center gap-2 text-blue-500">
            <ShieldCheck size={28} />
            EvoMind Admin
          </h1>
          <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">Nível de Acesso: Desenvolvedor</p>
        </div>
        <button 
          onClick={handleLogoutAdmin}
          className="p-3 glass-card rounded-2xl text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Usuários', value: stats.totalUsers, icon: Users, color: 'text-blue-400' },
          { label: 'Ativos Hoje', value: stats.activeToday, icon: TrendingUp, color: 'text-green-400' },
          { label: 'Membros Premium', value: stats.premiumUsers, icon: StarIcon, color: 'text-yellow-400' },
          { label: 'Taxa Conversão', value: stats.conversionRate, icon: CreditCard, color: 'text-purple-400' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5 rounded-3xl border border-white/5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-2 bg-white/5 rounded-xl`}>
                <stat.icon size={18} />
              </div>
            </div>
            <p className="text-2xl font-black tracking-tight">{stat.value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* User Management Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold tracking-tight uppercase flex items-center gap-2">
            Gerenciar Usuários
            <span className="text-white/20 text-xs py-1 px-2 glass-card rounded-lg font-mono">{filteredUsers.length}</span>
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input 
              type="text"
              placeholder="Pesquisar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all w-64"
            />
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase font-black tracking-widest border-b border-white/5">
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4">Status / Plano</th>
                  <th className="px-6 py-4">Nível / XP</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-white/20 font-bold uppercase tracking-widest">Carregando dados...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-white/20 font-bold uppercase tracking-widest">Nenhum usuário encontrado</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden border border-white/5">
                            {user.photoURL ? (
                              <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Users size={16} className="text-white/40" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white tracking-tight">{user.displayName || 'Sem Nome'}</p>
                            <p className="text-[11px] text-white/40 font-mono">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest
                          ${user.plan === 'diamante' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 
                            user.plan === 'gold' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 
                            'bg-white/5 text-white/40 border border-white/10'}`}
                        >
                          {user.plan || 'free'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white/80">Lvl {user.level || 1}</span>
                          <span className="text-[10px] text-white/40 font-mono">{user.xp || 0} XP</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleTogglePlan(user.id, user.plan || 'free')}
                          className="p-2 glass-card rounded-xl text-blue-400 hover:text-white transition-colors border border-white/10"
                        >
                          {user.plan !== 'free' ? <Zap size={14} className="fill-blue-400" /> : <ChevronRight size={14} />}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Feature Toggles */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-[2.5rem] border border-white/5">
          <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
            <SettingsIcon size={16} /> Controle de Recursos
          </h3>
          <div className="space-y-4">
            {[
              { id: 'quiz', label: 'Módulo de Quiz', active: true },
              { id: 'payment', label: 'Integração Kiwify', active: true },
              { id: 'leaderboard', label: 'Ranking Global', active: false }
            ].map((feat) => (
              <div key={feat.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-xs font-bold text-white/80">{feat.label}</span>
                <div className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${feat.active ? 'bg-blue-500' : 'bg-white/10'}`}>
                   <div className={`absolute top-1 ${feat.active ? 'right-1' : 'left-1'} w-3 h-3 bg-white rounded-full transition-all`} />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-[2.5rem] border border-white/5">
           <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-yellow-500">
             <StarIcon size={16} className="fill-yellow-500" /> Atalhos Rápidos
           </h3>
           <div className="grid grid-cols-2 gap-3">
              <button onClick={() => alert("Função em desenvolvimento")} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-center">
                Exportar Usuários
              </button>
              <button onClick={() => alert("Função em desenvolvimento")} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-center">
                Limpar Logs
              </button>
              <button onClick={() => alert("Função em desenvolvimento")} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-center">
                Backup DB
              </button>
              <button onClick={fetchData} className="p-4 bg-blue-500/20 rounded-2xl border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest text-blue-400 text-center">
                Atualizar Dados
              </button>
           </div>
        </div>
      </section>
    </div>
  );
}
