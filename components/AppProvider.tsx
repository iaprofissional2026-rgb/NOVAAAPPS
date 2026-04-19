'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface AppConfig {
  musicUrl: string;
  dailyPhrase: string;
  primaryColor: string;
  accentColor: string;
}

interface AppContextType {
  config: AppConfig | null;
  loading: boolean;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

const DEFAULT_CONFIG: AppConfig = {
  musicUrl: '',
  dailyPhrase: 'A jornada de mil milhas começa com um único passo.',
  primaryColor: '#3B82F6',
  accentColor: '#8B5CF6'
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const configRef = doc(db, 'config', 'global');
    const unsubscribe = onSnapshot(configRef, (docSnap) => {
      if (docSnap.exists()) {
        setConfig(docSnap.data() as AppConfig);
      } else {
        setConfig(DEFAULT_CONFIG);
      }
      setLoading(false);
    }, (error) => {
      console.error("Config Error:", error);
      setConfig(DEFAULT_CONFIG);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (config) {
      document.documentElement.style.setProperty('--primary-color', config.primaryColor);
      document.documentElement.style.setProperty('--accent-color', config.accentColor);
    }
  }, [config]);

  return (
    <AppContext.Provider value={{ config, loading }}>
      {children}
      <BackgroundMusic url={config?.musicUrl} />
    </AppContext.Provider>
  );
}

function BackgroundMusic({ url }: { url?: string }) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!url) return;
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.2;

    const playAudio = () => {
      audio.play().catch(e => console.log("Auto-play blocked", e));
      setPlaying(true);
      window.removeEventListener('click', playAudio);
    };

    window.addEventListener('click', playAudio);

    return () => {
      audio.pause();
      window.removeEventListener('click', playAudio);
    };
  }, [url]);

  return null;
}

export const useApp = () => useContext(AppContext);
