import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
  glow?: 'violet' | 'cyan' | 'amber' | 'rose' | 'none';
  specular?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  interactive = false,
  className = '',
  glow = 'none',
  specular = true,
  ...props
}) => {
  const glowClasses = {
    none: '',
    violet: 'shadow-[0_0_30px_rgba(139,92,246,0.18)] border-violet-500/25',
    cyan: 'shadow-[0_0_30px_rgba(6,182,212,0.18)] border-cyan-500/25',
    amber: 'shadow-[0_0_30px_rgba(245,158,11,0.18)] border-amber-500/25',
    rose: 'shadow-[0_0_30px_rgba(244,63,94,0.18)] border-rose-500/25',
  };

  const baseStyle = interactive ? 'glass-panel-interactive cursor-pointer' : 'glass-panel';
  const specularStyle = specular ? 'specular-border' : '';

  return (
    <div
      className={`rounded-2xl relative overflow-hidden ${baseStyle} ${specularStyle} ${glowClasses[glow]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
