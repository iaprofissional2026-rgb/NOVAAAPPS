'use client';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Mail, KeyRound, User } from 'lucide-react';
import React, { useState } from 'react';
import { EvoMindLogo } from '@/components/EvoMindLogo';
import { useAuth } from '@/components/AuthProvider';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      router.push('/dashboard');
    } catch (err: any) {
      alert(err.message || 'Erro ao entrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper className="h-[100dvh] bg-transparent px-6 py-12 justify-center relative">
      <div className="absolute top-[-10%] left-[-20%] w-[120%] h-[50%] bg-gradient-to-br from-blue-900/30 to-purple-900/10 rounded-b-[100%] blur-3xl opacity-50 pointer-events-none" />
      
      <div className="z-10 flex flex-col w-full max-w-sm mx-auto">
        <div className="flex flex-col items-center mb-10">
          <div className="mb-4">
            <EvoMindLogo className="w-24 h-24" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Bem-vindo de volta</h1>
          <p className="text-white/60 text-center text-[15px]">Entre para continuar sua evolução mental.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 mb-8">
          <div className="space-y-2">
            <div className="relative flex items-center">
              <User className="absolute left-4 text-white/50" size={20} />
              <input 
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nome de usuário" 
                className="w-full glass-card text-white rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-white/40 uppercase font-bold tracking-tight"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative flex items-center">
              <KeyRound className="absolute left-4 text-white/50" size={20} />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha" 
                className="w-full glass-card text-white rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-white/40"
              />
            </div>
          </div>
          <div className="pt-2">
            <PremiumButton type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Acessar Conta'}
            </PremiumButton>
          </div>
        </form>

        <div className="space-y-3">
          <PremiumButton variant="ghost" onClick={() => router.push('/quiz')}>
            Criar nova conta
          </PremiumButton>
        </div>
      </div>
    </ScreenWrapper>
  );
}
