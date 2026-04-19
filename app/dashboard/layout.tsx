'use client';
import { BottomNav } from '@/components/BottomNav';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-[100dvh] flex flex-col bg-transparent overflow-hidden">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-[80px]">
        <ScreenWrapper>{children}</ScreenWrapper>
      </div>
      <BottomNav />
    </div>
  )
}
