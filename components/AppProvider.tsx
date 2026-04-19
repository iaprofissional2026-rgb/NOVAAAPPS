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
  isMusicEnabled: boolean;
  toggleMusic: () => void;
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
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);

  useEffect(() => {
    // Try to restore user preference
    const saved = localStorage.getItem('music_enabled');
    if (saved !== null) setIsMusicEnabled(saved === 'true');
    
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

  const toggleMusic = () => {
    const newState = !isMusicEnabled;
    setIsMusicEnabled(newState);
    localStorage.setItem('music_enabled', String(newState));
  };

  return (
    <AppContext.Provider value={{ config, loading, isMusicEnabled, toggleMusic }}>
      {children}
      <BackgroundMusic url={config?.musicUrl} enabled={isMusicEnabled} />
    </AppContext.Provider>
  );
}

function BackgroundMusic({ url, enabled }: { url?: string; enabled: boolean }) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!url) {
      if (audio) {
        audio.pause();
        setAudio(null);
      }
      return;
    }

    const newAudio = new Audio(url);
    newAudio.loop = true;
    newAudio.volume = 0.2;
    setAudio(newAudio);

    return () => {
      newAudio.pause();
      newAudio.src = "";
    };
  }, [url]);

  useEffect(() => {
    if (!audio) return;

    if (enabled) {
      const play = () => {
        audio.play().catch(e => console.log("Auto-play blocked", e));
        window.removeEventListener('click', play);
        window.removeEventListener('touchstart', play);
      };
      
      // Attempt play immediately, if fails wait for interaction
      audio.play().catch(() => {
        window.addEventListener('click', play);
        window.addEventListener('touchstart', play);
      });
    } else {
      audio.pause();
    }
  }, [audio, enabled]);

  return null;
}

export const useApp = () => useContext(AppContext);
