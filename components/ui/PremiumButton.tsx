'use client';
import { motion } from 'motion/react';
import React from 'react';

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function PremiumButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  disabled = false,
  type = 'button'
}: PremiumButtonProps) {
  const base = "w-full py-3.5 rounded-[14px] font-semibold text-[14px] tracking-wide flex items-center justify-center gap-3 transition-all duration-200";
  const primary = "bg-white text-black hover:translate-y-[-2px] hover:shadow-[0_10px_20px_rgba(255,255,255,0.1)]";
  const secondary = "glass-card hover:bg-white/10 text-white shadow-xl";
  const outline = "bg-transparent border border-white/20 text-white/80 hover:border-white/40";
  const ghost = "bg-transparent shadow-none text-white/60 hover:text-white mt-2";

  const classes = variant === 'primary' ? primary : variant === 'secondary' ? secondary : variant === 'outline' ? outline : ghost;

  return (
    <motion.button
      type={type}
      initial={{ opacity: 0.9 }}
      whileHover={!disabled ? { opacity: 1, scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.96 } : {}}
      onClick={onClick}
      className={`${base} ${classes} ${className} ${disabled ? 'opacity-50 cursor-not-allowed shadow-none' : ''}`}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}
