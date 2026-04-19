'use client';
import { Home, CheckSquare, User, BookOpen } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'motion/react';

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { id: 'home', icon: Home, label: 'Início', path: '/dashboard' },
    { id: 'lessons', icon: BookOpen, label: 'Lições', path: '/dashboard/lessons' },
    { id: 'missions', icon: CheckSquare, label: 'Missões', path: '/dashboard/missions' },
    { id: 'profile', icon: User, label: 'Perfil', path: '/dashboard/profile' },
  ];

  return (
    <div className="absolute overflow-hidden bottom-0 w-full pb-[env(safe-area-inset-bottom)] bg-[#050508]/70 backdrop-blur-3xl border-t border-white/5 flex flex-row items-center justify-around px-2 z-50">
      <div className="flex w-full h-[64px] items-center justify-around">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.path)}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative group"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute top-0 w-6 h-[2px] bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`transition-colors flex items-center justify-center ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <span className={`text-[9px] font-medium transition-colors tracking-wide ${isActive ? 'text-white/90' : 'text-white/40'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
