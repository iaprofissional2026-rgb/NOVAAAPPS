'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Target, Music, BookOpen, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export function BottomNav() {
  const pathname = usePathname();
  const { profile } = useAuth();
  
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
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#0a0a0f]/80 backdrop-blur-xl border-t border-white/5 pb-8 pt-3 px-4 z-50 flex justify-between items-center h-20">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-primary scale-110' : 'text-white/40 hover:text-white/60'}`}
          >
            <item.icon size={22} className={isActive ? 'fill-primary/20' : ''} />
            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
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
