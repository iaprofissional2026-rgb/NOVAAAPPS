import React from 'react';

export function EvoMindLogo({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 200 160" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />  {/* Cyan */}
          <stop offset="30%" stopColor="#3b82f6" /> {/* Blue */}
          <stop offset="70%" stopColor="#8b5cf6" /> {/* Purple */}
          <stop offset="100%" stopColor="#ec4899" /> {/* Pink */}
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g filter="url(#glow)">
        {/* Left Hemisphere Circuits */}
        <path d="M40,80 C30,70 30,50 45,45 C50,30 70,25 85,30 C90,20 110,20 120,25" 
              stroke="url(#brainGradient)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        
        <path d="M42,90 C32,95 45,110 55,105 C60,120 75,125 85,115 C90,135 105,135 110,120 M75,115 L60,110 M110,120 L95,105" 
              stroke="url(#brainGradient)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

        {/* Right Hemisphere Circuits */}
        <path d="M120,25 C135,20 160,30 155,50 C170,55 170,75 160,85 C175,95 165,115 150,110 C155,125 140,135 125,125 C130,140 115,145 105,135" 
              stroke="url(#brainGradient)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

        {/* Inner Circuit Pathways */}
        <path d="M50,60 L70,60 L85,75 L115,75" 
              stroke="url(#brainGradient)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="50" cy="60" r="4" fill="url(#brainGradient)" />
        <circle cx="115" cy="75" r="4" fill="url(#brainGradient)" />

        <path d="M45,75 L65,75 L80,60 L110,60 L130,40" 
              stroke="url(#brainGradient)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="45" cy="75" r="4" fill="url(#brainGradient)" />
        <circle cx="130" cy="40" r="4" fill="url(#brainGradient)" />

        <path d="M55,90 L75,90 L95,70 L140,70 L155,85" 
              stroke="url(#brainGradient)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="55" cy="90" r="4" fill="url(#brainGradient)" />
        <circle cx="155" cy="85" r="4" fill="url(#brainGradient)" />

        <path d="M65,105 L85,105 L105,85 L135,85 L145,95" 
              stroke="url(#brainGradient)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="65" cy="105" r="4" fill="url(#brainGradient)" />
        <circle cx="145" cy="95" r="4" fill="url(#brainGradient)" />
        
        {/* Core connection */}
        <line x1="85" y1="45" x2="115" y2="45" stroke="url(#brainGradient)" strokeWidth="5" strokeLinecap="round" />
        <circle cx="85" cy="45" r="4" fill="url(#brainGradient)" />
        <circle cx="115" cy="45" r="4" fill="url(#brainGradient)" />
      </g>
    </svg>
  );
}
