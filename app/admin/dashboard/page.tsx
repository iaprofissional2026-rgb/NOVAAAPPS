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
  Star as StarIcon,
  Music,
  Quote,
  Palette,
  Target,
  Plus,
  Trash2,
  Save,
  Rocket
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, orderBy, limit, doc, updateDoc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { PremiumButton } from '@/components/ui/PremiumButton';

type TabType = 'dashboard' | 'config' | 'missions';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    premiumUsers: 0,
    conversionRate: '0%'
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // App Config States
  const [appConfig, setAppConfig] = useState({
    musicUrl: '',
    dailyPhrase: '',
    primaryColor: '#3B82F6',
    accentColor: '#8B5CF6'
  });
  
  // Missions States
  const [missions, setMissions] = useState<any[]>([]);
  const [newMission, setNewMission] = useState({
    title: '',
    description: '',
    xpReward: 100,
    planRequired: 'free'
  });

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
        activeToday: Math.floor(userList.length * 0.4),
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
    const adminSession = sessionStorage.getItem('admin_session');
    if (!adminSession) {
      router.replace('/admin/login');
      return;
    }

    fetchData();

    // Listen to Config
    const unsubConfig = onSnapshot(doc(db, 'config', 'global'), (snap) => {
      if (snap.exists()) setAppConfig(snap.data() as any);
    });

    // Listen to Missions
    const unsubMissions = onSnapshot(collection(db, 'missions'), (snap) => {
      setMissions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubConfig();
      unsubMissions();
    };
  }, [router]);

  const handleUpdateConfig = async () => {
    try {
      await setDoc(doc(db, 'config', 'global'), appConfig);
      alert("Configurações atualizadas!");
    } catch (err) {
      alert("Erro ao atualizar config.");
    }
  };

  const handleAddMission = async () => {
    if (!newMission.title) return;
    try {
      const missionRef = doc(collection(db, 'missions'));
      await setDoc(missionRef, {
        ...newMission,
        createdAt: new Date().toISOString()
      });
      setNewMission({ title: '', description: '', xpReward: 100, planRequired: 'free' });
    } catch (err) {
      alert("Erro ao criar missão.");
    }
  };

  const handleDeleteMission = async (id: string) => {
    if (confirm("Deletar esta missão?")) {
      await deleteDoc(doc(db, 'missions', id));
    }
  };

  const handleTogglePlan = async (userId: string, currentPlan: string) => {
    const plans: ('free' | 'iron' | 'gold' | 'diamante')[] = ['free', 'iron', 'gold', 'diamante'];
    const currentIndex = plans.indexOf(currentPlan as any);
    const nextIndex = (currentIndex + 1) % plans.length;
    const newPlan = plans[nextIndex];
    
    try {
      await updateDoc(doc(db, 'users', userId), { plan: newPlan });
      fetchData(); // Refresh
    } catch (err) {
      alert("Erro ao alterar plano.");
    }
  };

  const handleLogoutAdmin = () => {
    sessionStorage.removeItem('admin_session');
    router.replace('/');
  };

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050508] text-white p-6 pb-20">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase flex items-center gap-2 text-blue-500">
            <ShieldCheck size={28} />
            EvoMind Admin
          </h1>
          <div className="flex gap-2 mt-2">
            {(['dashboard', 'config', 'missions'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all border ${
                  activeTab === tab 
                  ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20' 
                  : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
                }`}
              >
                {tab === 'dashboard' ? 'Geral' : tab === 'config' ? 'Config' : 'Missões'}
              </button>
            ))}
          </div>
        </div>
        <button 
          onClick={handleLogoutAdmin}
          className="p-3 glass-card rounded-2xl text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={20} />
        </button>
      </header>

      {activeTab === 'dashboard' && (
        <>
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
                  placeholder="Pesquisar..."
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
                                <Users size={16} className="text-white/40" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white tracking-tight">{user.displayName || 'Sem Nome'}</p>
                                <p className="text-[11px] text-white/40 font-mono">@{user.username || 'n/a'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest
                              ${user.plan === 'diamante' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 
                                user.plan === 'gold' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 
                                user.plan === 'iron' ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30' :
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
                              <ChevronRight size={14} />
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
        </>
      )}

      {activeTab === 'config' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-xl"><Palette size={18} className="text-blue-400" /></div>
              Aparência do App
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-3 block">Cor Primária</label>
                <div className="flex gap-4 items-center">
                  <input 
                    type="color" 
                    value={appConfig.primaryColor}
                    onChange={(e) => setAppConfig({...appConfig, primaryColor: e.target.value})}
                    className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer"
                  />
                  <input 
                    type="text"
                    value={appConfig.primaryColor}
                    onChange={(e) => setAppConfig({...appConfig, primaryColor: e.target.value.toUpperCase()})}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-mono text-sm uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-3 block">Cor de Destaque (Accent)</label>
                <div className="flex gap-4 items-center">
                  <input 
                    type="color" 
                    value={appConfig.accentColor}
                    onChange={(e) => setAppConfig({...appConfig, accentColor: e.target.value})}
                    className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer"
                  />
                  <input 
                    type="text"
                    value={appConfig.accentColor}
                    onChange={(e) => setAppConfig({...appConfig, accentColor: e.target.value.toUpperCase()})}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-mono text-sm uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-xl"><Music size={18} className="text-purple-400" /></div>
              Ambiente e Mídia
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-3 block">Música de Fundo (MP3 URL)</label>
                <div className="relative">
                  <Music className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input 
                    type="text"
                    value={appConfig.musicUrl}
                    onChange={(e) => setAppConfig({...appConfig, musicUrl: e.target.value})}
                    placeholder="https://exemplo.com/audio.mp3"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-3 block">Frase do Dia</label>
                <div className="relative">
                  <Quote className="absolute left-4 top-5 text-white/30" size={16} />
                  <textarea 
                    value={appConfig.dailyPhrase}
                    onChange={(e) => setAppConfig({...appConfig, dailyPhrase: e.target.value})}
                    rows={3}
                    placeholder="Digite a frase inspiradora de hoje..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <PremiumButton onClick={handleUpdateConfig} className="bg-white text-black font-black uppercase tracking-tight py-4 flex items-center justify-center gap-2">
              <Save size={18} />
              Salvar Alterações Globais
            </PremiumButton>
          </div>
        </motion.div>
      )}

      {activeTab === 'missions' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-xl"><Plus size={18} className="text-blue-400" /></div>
              Criar Nova Missão
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-3 block mx-1">Título da Missão</label>
                <input 
                  type="text"
                  value={newMission.title}
                  onChange={(e) => setNewMission({...newMission, title: e.target.value})}
                  placeholder="Ex: 50 Flexões Diárias"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm"
                />
              </div>
              <div>
                <label className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-3 block mx-1">Recompensa (XP)</label>
                <input 
                  type="number"
                  value={newMission.xpReward}
                  onChange={(e) => setNewMission({...newMission, xpReward: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-3 block mx-1">Descrição</label>
                <textarea 
                  value={newMission.description}
                  rows={2}
                  onChange={(e) => setNewMission({...newMission, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm resize-none"
                />
              </div>
              <div>
                <label className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-3 block mx-1">Requisito de Plano</label>
                <select 
                  value={newMission.planRequired}
                  onChange={(e) => setNewMission({...newMission, planRequired: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white/60 appearance-none uppercase font-bold tracking-widest"
                >
                  <option value="free">FREE (Todos)</option>
                  <option value="iron">IRON</option>
                  <option value="gold">GOLD</option>
                  <option value="diamante">DIAMANTE</option>
                </select>
              </div>
            </div>
            
            <PremiumButton onClick={handleAddMission} className="bg-blue-600 text-white font-black uppercase tracking-tight py-4 flex items-center justify-center gap-2">
              <Rocket size={18} />
              Publicar Missão
            </PremiumButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((mission) => (
              <div key={mission.id} className="glass-card p-6 rounded-[2rem] border border-white/5 relative group">
                <button 
                  onClick={() => handleDeleteMission(mission.id)}
                  className="absolute top-4 right-4 p-2 text-white/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                    <Target size={18} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest py-1 px-2 bg-white/5 rounded-lg border border-white/5">
                    {mission.planRequired}
                  </span>
                </div>
                <h4 className="font-bold text-white mb-2">{mission.title}</h4>
                <p className="text-xs text-white/40 mb-5 line-clamp-2">{mission.description}</p>
                <div className="flex items-center gap-2 text-blue-400">
                  <Zap size={14} className="fill-blue-400" />
                  <span className="text-xs font-black uppercase tracking-widest">+{mission.xpReward} XP</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
