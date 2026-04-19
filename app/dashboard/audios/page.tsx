'use client';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Lock, Play, Pause, ChevronLeft, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';

const AUDIOS = [
  { id: 1, title: 'Reprogramação de Foco Matinal', duration: '12:45', plan: 'gold', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Superando o Medo do Fracasso', duration: '15:20', plan: 'gold', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Visualização de Sucesso Extremo', duration: '10:10', plan: 'gold', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 4, title: 'Indução ao Sono Profundo e Criativo', duration: '20:00', plan: 'diamante', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: 5, title: 'Mindset de Inabalável', duration: '18:30', plan: 'diamante', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
];

export default function AudiosPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const planRank: Record<string, number> = {
    'free': 0,
    'iron': 1,
    'gold': 2,
    'diamante': 3
  };

  const isLocked = (audioPlan: string) => {
    const userRank = planRank[profile?.plan || 'free'];
    const requiredRank = planRank[audioPlan];
    return userRank < requiredRank;
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, playingId]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlay = (id: number) => {
    if (playingId === id) {
      setIsPlaying(!isPlaying);
    } else {
      setPlayingId(id);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  const currentAudio = AUDIOS.find(a => a.id === playingId);

  return (
    <div className="min-h-screen bg-[#050508] text-white p-6 pb-48 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/30 blur-[120px] rounded-full" />
      </div>

      <header className="flex items-center gap-4 mb-10 relative z-10">
        <button onClick={() => router.back()} className="p-3 glass-card rounded-2xl text-white/60 hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Áudios de Poder</h1>
          <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Reprogramação Mental</p>
        </div>
      </header>

      <div className="space-y-4 relative z-10">
        {AUDIOS.map((audio) => {
          const locked = isLocked(audio.plan);
          const active = playingId === audio.id;

          return (
            <motion.div
              key={audio.id}
              whileHover={!locked ? { scale: 1.02, x: 5 } : {}}
              whileTap={!locked ? { scale: 0.98 } : {}}
              onClick={() => {
                if (locked) return router.push('/premium');
                togglePlay(audio.id);
              }}
              className={`glass-card p-5 rounded-3xl border border-white/5 flex items-center justify-between transition-all ${
                locked ? 'opacity-50 grayscale' : 'hover:bg-white/5 cursor-pointer'
              } ${active ? 'border-primary/40 bg-primary/5' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl transition-all duration-500 ${
                  active && isPlaying 
                    ? 'bg-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-110' 
                    : 'bg-white/5 text-white/40'
                }`}>
                  {active && isPlaying ? (
                    <div className="flex items-end gap-[2px] h-5 w-5 justify-center pb-1">
                      <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-current rounded-full" />
                      <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-1 bg-current rounded-full" />
                      <motion.div animate={{ height: [6, 14, 6] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-1 bg-current rounded-full" />
                    </div>
                  ) : <Music size={20} />}
                </div>
                <div>
                  <h3 className={`text-sm font-bold tracking-tight ${locked ? 'text-white/40' : 'text-white'}`}>{audio.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-white/20 font-mono tracking-tighter">{audio.duration}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${
                      audio.plan === 'diamante' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20' : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20'
                    }`}>
                      {audio.plan}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center w-10 h-10 rounded-full glass-card border border-white/5">
                {locked ? (
                  <Lock size={16} className="text-white/20" />
                ) : active && isPlaying ? (
                  <Pause size={18} className="text-primary fill-primary" />
                ) : (
                  <Play size={18} className="text-white/40 group-hover:text-primary transition-colors fill-white/10" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Hidden Audio Element */}
      {playingId && (
        <audio
          ref={audioRef}
          src={currentAudio?.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      {/* Persistent Mini Player */}
      <AnimatePresence>
        {playingId && (
          <motion.div 
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[420px] z-50"
          >
            <div className="glass-card p-6 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              {/* Progress Bar Container */}
              <div className="mb-6 group">
                <div className="flex justify-between text-[10px] font-mono text-white/40 mb-2 px-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer outline-none accent-primary transition-all group-hover:h-2"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 overflow-hidden">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-0.5">Sintonizando Frequência</p>
                   <p className="text-sm font-bold text-white truncate pr-4">{currentAudio?.title}</p>
                </div>

                <div className="flex items-center gap-3">
                   {/* Volume Control */}
                   <div className="flex items-center gap-2 group/vol relative">
                      <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-white/40 hover:text-white transition-colors">
                        {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                      </button>
                      <div className="w-0 group-hover/vol:w-20 transition-all duration-300 overflow-hidden flex items-center">
                        <input 
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={(e) => {
                            setVolume(parseFloat(e.target.value));
                            setIsMuted(false);
                          }}
                          className="w-16 h-1 bg-white/10 rounded-full appearance-none accent-white cursor-pointer"
                        />
                      </div>
                   </div>

                   <button 
                    onClick={() => setIsPlaying(!isPlaying)} 
                    className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-110 active:scale-95 transition-all"
                   >
                    {isPlaying ? <Pause size={24} className="fill-black" /> : <Play size={24} className="fill-black ml-1" />}
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
