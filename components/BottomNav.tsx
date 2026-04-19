'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Target, Music, BookOpen, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { motion } from 'motion/react';
import { useApp } from '@/components/AppProvider';

export function BottomNav() {
  const pathname = usePathname();
  const { profile } = useAuth();
  const { config } = useApp();
  
  if (pathname.includes('/admin') || pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === '/onboarding') {
    return null;
  }

  const navItems = [
    { label: 'Início', icon: Home, href: '/dashboard' },
    { label: 'Missões', icon: Target, href: '/dashboard/missions' },
    { label: 'Audios', icon: Music, href: '/dashboard/audios' },
    { label: 'Guias', icon: BookOpen, href: '/dashboard/guides' },
    { label: 'Perfil', icon: User, href: '/dashboard/profile' },
  ];

  const isAdmin = profile?.username === 'novaaapsadmin';

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#0a0a0f]/90 backdrop-blur-2xl border-t border-white/5 pb-8 pt-3 px-4 z-50 flex justify-between items-center h-22">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const color = isActive ? (config?.primaryColor || '#3b82f6') : 'rgba(255,255,255,0.4)';
        
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className="relative"
          >
            <motion.div 
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'scale-110' : 'hover:opacity-80'}`}
              style={{ color }}
            >
              <item.icon size={22} className={isActive ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : ''} />
              <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-2 w-1 h-1 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}
            </motion.div>
          </Link>
        );
      })}
      {isAdmin && (
        <Link 
          href="/admin/dashboard"
          className="flex flex-col items-center gap-1 text-yellow-500/60 hover:text-yellow-500"
        >
          <ShieldCheck size={22} />
          <span className="text-[10px] font-black uppercase tracking-widest">Admin</span>
        </Link>
      )}
    </nav>
  );
}
