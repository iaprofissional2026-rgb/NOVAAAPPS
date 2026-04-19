'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ShieldAlert, KeyRound, Clock, ChevronLeft } from 'lucide-react';
import { hashPassword, ADMIN_HASH, recordAttempt, checkLockout } from '@/lib/admin-security';
import { PremiumButton } from '@/components/ui/PremiumButton';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [lockout, setLockout] = useState({ locked: false, remaining: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const status = checkLockout();
      setLockout(status);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockout.locked) return;

    setLoading(true);
    setError('');

    try {
      const hashed = await hashPassword(password);
      if (hashed === ADMIN_HASH) {
        recordAttempt(true);
        // Set a secure session flag
        sessionStorage.setItem('admin_session', 'true');
        router.push('/admin/dashboard');
      } else {
        recordAttempt(false);
        setError('Acesso Negado. Credencial inválida.');
        setPassword('');
      }
    } catch (err) {
      setError('Erro no servidor de autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#050508] px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
            <ShieldAlert size={32} className="text-blue-500" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight text-center uppercase">Acesso Restrito</h1>
          <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mt-2">Área do Desenvolvedor</p>
        </div>

        <form onSubmit={handleLogin} className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="mb-6">
            <label className="text-white/60 text-[10px] uppercase font-black tracking-widest mb-3 block">Chave de Criptografia</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                disabled={lockout.locked || loading}
                placeholder="••••••••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 transition-all font-mono"
              />
            </div>
            {error && <p className="text-red-500 text-[10px] font-bold uppercase mt-3 text-center">{error}</p>}
          </div>

          <PremiumButton 
            onClick={() => {}} // Form handled by onSubmit
            disabled={lockout.locked || loading || !password}
            className="bg-white text-black font-black uppercase tracking-tight py-4"
          >
            {loading ? 'Validando...' : 'Autenticar'}
          </PremiumButton>

          {lockout.locked && (
            <div className="mt-6 flex flex-col items-center gap-2">
              <Clock size={16} className="text-white/20" />
              <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Bloqueio Ativo: {lockout.remaining}s</p>
            </div>
          )}
        </form>

        <button 
          onClick={() => router.replace('/')}
          className="mt-8 text-white/20 hover:text-white/40 transition-colors flex items-center gap-2 mx-auto text-[10px] font-black uppercase tracking-widest"
        >
          <ChevronLeft size={14} /> Voltar ao Início
        </button>
      </motion.div>
    </div>
  );
}
