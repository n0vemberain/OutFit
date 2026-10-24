import React from 'react';

export const AmbientBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#0B0F19] overflow-hidden text-slate-100 flex flex-col">
      {/* Radiant Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Electric Violet Orb - Top Left */}
        <div className="absolute -top-[15%] -left-[10%] w-[650px] h-[650px] rounded-full bg-violet-600/15 blur-[140px] animate-float-slow" />

        {/* Neon Cyan Orb - Top Right */}
        <div className="absolute top-[5%] -right-[15%] w-[600px] h-[600px] rounded-full bg-cyan-500/12 blur-[130px] animate-float-reverse" />

        {/* Rose Glow Orb - Center Bottom */}
        <div className="absolute bottom-[10%] left-[25%] w-[550px] h-[550px] rounded-full bg-rose-500/10 blur-[150px] animate-float-slow" />

        {/* Warm Amber Accent - Bottom Right */}
        <div className="absolute -bottom-[10%] -right-[10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[130px]" />

        {/* Subtle grid pattern overlay for high-tech luxury feel */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 flex-1 flex flex-col">{children}</div>
    </div>
  );
};
