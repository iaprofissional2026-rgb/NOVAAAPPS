'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { EvoMindLogo } from '@/components/EvoMindLogo';
import { useState } from 'react';

export default function Splash() {
  const router = useRouter();
  const [clicks, setClicks] = useState(0);
  
  const handleLogoClick = () => {
    const newCount = clicks + 1;
    if (newCount >= 5) {
      router.push('/admin/login');
      return;
    }
    setClicks(newCount);
  };
  
  useEffect(() => {
    const t = setTimeout(() => {
      if (clicks < 5) router.replace('/onboarding');
    }, 2500);
    return () => clearTimeout(t);
  }, [router, clicks]);

  return (
    <div className="h-[100dvh] flex flex-col items-center justify-center bg-transparent relative overflow-hidden">
      {/* Animated background grad */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[150vw] max-w-[800px] aspect-square bg-gradient-to-tr from-blue-900/40 via-purple-900/40 to-transparent blur-[120px] rounded-full pointer-events-none"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 flex flex-col items-center"
      >
        <div className="relative mb-6 cursor-pointer active:scale-95 transition-transform" onClick={handleLogoClick}>
          <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-[40px] opacity-20"
          />
          <div className="relative flex items-center justify-center">
            <EvoMindLogo className="w-40 h-32" />
          </div>
        </div>
        
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
        >
          EvoMind
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-4 text-white/50 text-sm tracking-widest uppercase font-bold"
        >
          Evolução Mental
        </motion.p>
      </motion.div>
    </div>
  )
}
