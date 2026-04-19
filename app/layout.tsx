import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NeuronBackground } from '@/components/NeuronBackground';
import { AuthProvider } from '@/components/AuthProvider';
import { AppProvider } from '@/components/AppProvider';
import { BottomNav } from '@/components/BottomNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EvoMind',
  description: 'Aplicativo premium de disciplina e evolução pessoal',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-black text-white antialiased overflow-hidden`} suppressHydrationWarning>
        <AuthProvider>
          <AppProvider>
            <div className="flex justify-center w-full h-[100dvh] bg-[#050508]">
              <div className="w-full max-w-md h-full relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-y-auto no-scrollbar bg-[#0a0a0f] pb-24">
                <NeuronBackground />
                <div className="relative z-10 h-full w-full">
                  {children}
                </div>
                <BottomNav />
              </div>
            </div>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
