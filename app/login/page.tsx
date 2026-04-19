'use client';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Mail, KeyRound } from 'lucide-react';
import React, { useState } from 'react';
import { EvoMindLogo } from '@/components/EvoMindLogo';
import { useAuth } from '@/components/AuthProvider';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInWithGoogle, user } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Por favor, utilize o login com Google.');
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      router.push('/dashboard'); // Go directly to dashboard!
    } catch {
      alert('Erro ao fazer login com Google.');
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
              <Mail className="absolute left-4 text-white/50" size={20} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu email" 
                className="w-full glass-card text-white rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-white/40"
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
            <PremiumButton type="submit">Acessar Conta</PremiumButton>
          </div>
        </form>

        <div className="relative flex items-center py-4 mb-6">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-white/50 text-sm font-medium">Ou continue com</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <div className="space-y-3">
          <PremiumButton variant="secondary" onClick={() => handleGoogle()}>
            <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 24c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 21.53 7.7 24 12 24z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 4.64c1.61 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            Google
          </PremiumButton>
          <PremiumButton variant="ghost" onClick={() => router.push('/quiz')}>
            Criar nova conta
          </PremiumButton>
        </div>
      </div>
    </ScreenWrapper>
  );
}
