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
import { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, orderBy, limit, doc, updateDoc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { format, subDays, startOfDay, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type TabType = 'dashboard' | 'config' | 'missions' | 'stats';

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
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute Chart Data
  const chartData = useMemo(() => {
    if (!users.length) return [];
    
    // Growth over last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return {
        date: format(date, 'dd/MM'),
        dateObj: startOfDay(date),
        count: 0
      };
    }).reverse();

    users.forEach(user => {
      if (user.createdAt) {
        const createdDate = user.createdAt.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
        const dayMatch = last7Days.find(d => 
          format(d.dateObj, 'dd/MM') === format(createdDate, 'dd/MM')
        );
        if (dayMatch) dayMatch.count++;
      }
    });

    return last7Days;
  }, [users]);

  const planData = useMemo(() => {
    const counts: Record<string, number> = {
      'free': 0,
      'iron': 0,
      'gold': 0,
      'diamante': 0
    };
    users.forEach(u => {
      const p = u.plan || 'free';
      counts[p] = (counts[p] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [users]);

  const PLAN_COLORS = {
    free: '#94A3B8',
    iron: '#64748B',
    gold: '#EAB308',
    diamante: '#06B6D4'
  };

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

    const init = async () => {
      await fetchData();
    };
    init();

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
      setLoading(true);
      await setDoc(doc(db, 'config', 'global'), appConfig);
      alert("Configurações globais salvas com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar configurações. Verifique sua permissão.");
    } finally {
      setLoading(false);
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
          <div className="flex items-center gap-4 mt-2">
            <div className="flex gap-2">
              {(['dashboard', 'stats', 'config', 'missions'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all border ${
                    activeTab === tab 
                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
                  }`}
                >
                  {tab === 'dashboard' ? 'Geral' : tab === 'stats' ? 'Dados' : tab === 'config' ? 'Config' : 'Missões'}
                </button>
              ))}
            </div>
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            <div className="flex flex-col items-end">
              <p className="text-[12px] font-mono font-bold text-white/80 tabular-nums">
                {format(currentTime, 'HH:mm:ss')}
              </p>
              <p className="text-[8px] font-black uppercase tracking-widest text-white/30">
                {format(currentTime, "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
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

      {activeTab === 'stats' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Growth Chart */}
            <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 h-[400px]">
              <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-xl"><TrendingUp size={18} className="text-blue-400" /></div>
                Crescimento de Usuários (7 dias)
              </h3>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#ffffff20" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#ffffff20" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#151619', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                      itemStyle={{ color: '#3B82F6' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorCount)" 
                      name="Novos Usuários"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Plan Distribution */}
            <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 h-[400px]">
              <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-xl"><CreditCard size={18} className="text-yellow-400" /></div>
                Distribuição de Planos
              </h3>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {planData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PLAN_COLORS[entry.name as keyof typeof PLAN_COLORS]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#151619', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: '12px'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* XP Ranking */}
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 min-h-[400px]">
            <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-xl"><Zap size={18} className="text-purple-400" /></div>
              Maiores Pontuadores (Top XP)
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={users.sort((a,b) => (b.xp || 0) - (a.xp || 0)).slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="username" 
                    stroke="#ffffff20" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#ffffff20" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#151619', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '12px'
                    }}
                  />
                  <Bar dataKey="xp" fill="#8B5CF6" radius={[6, 6, 0, 0]} name="XP Total" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
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
            <PremiumButton 
              onClick={handleUpdateConfig} 
              disabled={loading}
              className="bg-white text-black font-black uppercase tracking-tight py-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full" />
              ) : (
                <Save size={18} />
              )}
              {loading ? 'Salvando...' : 'Salvar Alterações Globais'}
            </PremiumButton>
          </div>
        </motion.div>
      )}

      {activeTab === 'missions' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <form onSubmit={(e) => {
          e.preventDefault();
          handleAddMission();
        }} className="glass-card p-8 rounded-[2.5rem] border border-white/5">
          <h3 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-xl"><Plus size={18} className="text-blue-400" /></div>
            Criar Nova Missão
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-3 block mx-1">Título da Missão</label>
              <input 
                type="text"
                required
                value={newMission.title}
                onChange={(e) => setNewMission({...newMission, title: e.target.value})}
                placeholder="Ex: 50 Flexões Diárias"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-blue-500/50 transition-all"
              />
            </div>
            <div>
              <label className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-3 block mx-1">Recompensa (XP)</label>
              <input 
                type="number"
                required
                value={newMission.xpReward}
                onChange={(e) => setNewMission({...newMission, xpReward: parseInt(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-blue-500/50 transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-3 block mx-1">Descrição</label>
              <textarea 
                required
                value={newMission.description}
                rows={2}
                onChange={(e) => setNewMission({...newMission, description: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm resize-none focus:border-blue-500/50 transition-all"
              />
            </div>
            <div>
              <label className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-3 block mx-1">Requisito de Plano</label>
              <div className="relative">
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
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-white/20 pointer-events-none" size={14} />
              </div>
            </div>
          </div>
          
          <PremiumButton type="submit" className="bg-blue-600 text-white font-black uppercase tracking-tight py-4 flex items-center justify-center gap-2 hover:bg-blue-500">
            <Rocket size={18} />
            Publicar Missão
          </PremiumButton>
        </form>

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
