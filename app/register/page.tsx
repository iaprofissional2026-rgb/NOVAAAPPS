'use client';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { User, KeyRound, ArrowRight, UserCircle } from 'lucide-react';
import React, { useState } from 'react';
import { EvoMindLogo } from '@/components/EvoMindLogo';
import { useAuth } from '@/components/AuthProvider';

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await register(username, password, displayName);
      router.push('/dashboard');
    } catch (err: any) {
      alert(err.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper className="h-[100dvh] bg-transparent px-6 py-12 justify-center relative">
      <div className="absolute top-[-10%] left-[-20%] w-[120%] h-[50%] bg-gradient-to-br from-blue-900/30 to-purple-900/10 rounded-b-[100%] blur-3xl opacity-50 pointer-events-none" />
      
      <div className="z-10 flex flex-col w-full max-w-sm mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <EvoMindLogo className="w-16 h-16" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1 uppercase">Crie sua Forja</h1>
          <p className="text-white/40 text-center text-xs font-bold uppercase tracking-widest">Inicie sua reprogramação mental.</p>
        </div>

        <form onSubmit={handleRegister} className="glass-card p-6 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-5">
          <div>
            <label className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-2 block mx-1">Como devemos te chamar?</label>
            <div className="relative flex items-center">
              <UserCircle className="absolute left-4 text-white/30" size={18} />
              <input 
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="NOME DE EXIBIÇÃO" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all font-bold tracking-tight"
              />
            </div>
          </div>

          <div>
            <label className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-2 block mx-1">Identidade (Username)</label>
            <div className="relative flex items-center">
              <User className="absolute left-4 text-white/30" size={18} />
              <input 
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="USUÁRIO" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all font-bold tracking-tight uppercase"
              />
            </div>
          </div>

          <div>
            <label className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-2 block mx-1">Segurança</label>
            <div className="relative flex items-center">
              <KeyRound className="absolute left-4 text-white/30" size={18} />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="SENHA" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <PremiumButton type="submit" disabled={loading} className="bg-white text-black font-black uppercase py-4">
              {loading ? 'Processando...' : 'Criar minha conta'}
              {!loading && <ArrowRight size={18} className="ml-2" />}
            </PremiumButton>
          </div>
        </form>

        <button 
          onClick={() => router.push('/login')}
          className="mt-8 text-white/40 hover:text-white transition-colors text-center text-[10px] font-black uppercase tracking-widest"
        >
          Já tenho uma conta? <span className="text-white underline ml-1">Entrar</span>
        </button>
      </div>
    </ScreenWrapper>
  );
}
