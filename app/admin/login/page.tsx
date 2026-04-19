'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ShieldAlert, ShieldCheck, KeyRound, User, Clock, ChevronLeft } from 'lucide-react';
import { recordAttempt, checkLockout } from '@/lib/admin-security';
import { PremiumButton } from '@/components/ui/PremiumButton';

export default function AdminLogin() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [lockout, setLockout] = useState({ locked: false, remaining: 0 });
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setLockout(checkLockout());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 8 || loading || success) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.success) {
        recordAttempt(true);
        setSuccess(true);
        sessionStorage.setItem('admin_session', 'true');
        
        // Immediate redirect attempt + UI update
        router.replace('/admin/dashboard');
        
        // Fallback if the above doesn't work after 1s
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 1000);
      } else {
        recordAttempt(false);
        setError(data.error || 'Código de acesso inválido.');
        setCode('');
      }
    } catch (err: any) {
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = code.length === 8 && !lockout.locked && !loading;

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
            {success ? (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}>
                <ShieldCheck size={32} className="text-green-500" />
              </motion.div>
            ) : (
              <ShieldAlert size={32} className="text-blue-500" />
            )}
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight text-center uppercase">
            {success ? 'Acesso Confirmado' : 'Acesso Mestre'}
          </h1>
          <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mt-2 text-center">
            {success ? 'Iniciando terminal administrativo...' : 'Área de Autenticação'}
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleLogin} className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
            <div className="space-y-4">
              <label className="text-white/60 text-[10px] uppercase font-black tracking-widest block text-center">Digite o Código de 8 Dígitos</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input 
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={8}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                  disabled={lockout.locked || loading}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-4 text-white text-center text-2xl placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 transition-all font-black tracking-[0.2em]"
                />
              </div>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-red-500 text-[10px] font-bold uppercase text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <div className="relative">
              <PremiumButton 
                type="submit"
                disabled={!isFormValid}
                className={`py-4 font-black uppercase tracking-tight transition-all duration-300 ${isFormValid ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-white/10 text-white/20'}`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full" />
                    Verificando...
                  </span>
                ) : 'Liberar Painel'}
              </PremiumButton>
            </div>

            {lockout.locked && (
              <div className="mt-6 flex flex-col items-center gap-2">
                <Clock size={16} className="text-white/20" />
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Aguarde: {lockout.remaining}s</p>
              </div>
            )}
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-10 rounded-[2.5rem] border border-green-500/20 shadow-2xl flex flex-col items-center gap-6"
          >
            <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20">
              <ShieldCheck className="text-green-500" size={32} />
            </div>
            <div className="text-center">
              <h3 className="text-white font-black uppercase tracking-tight">Sessão Ativada</h3>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-2 px-4 leading-relaxed">
                As credenciais foram validadas. Entrando no sistema de controle...
              </p>
            </div>
            
            <div className="w-full flex flex-col gap-3 mt-4">
              <motion.div 
                className="h-1 bg-green-500/20 rounded-full overflow-hidden"
              >
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="h-full bg-green-500"
                />
              </motion.div>
              <button 
                onClick={() => window.location.href = '/admin/dashboard'}
                className="text-white/20 hover:text-white/40 transition-colors text-[10px] font-black uppercase tracking-widest py-2"
              >
                Clique aqui se não redirecionar
              </button>
            </div>
          </motion.div>
        )}

        {!success && (
          <button 
            onClick={() => router.replace('/')}
            className="mt-8 text-white/20 hover:text-white/40 transition-colors flex items-center gap-2 mx-auto text-[10px] font-black uppercase tracking-widest"
          >
            <ChevronLeft size={14} /> Voltar ao Início
          </button>
        )}
      </motion.div>
    </div>
  );
}
