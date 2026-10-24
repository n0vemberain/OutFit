import React from 'react';

interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: 'violet' | 'cyan' | 'amber' | 'emerald' | 'rose' | 'slate';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variantStyles = {
    violet: {
      bg: 'bg-violet-500/10 border-violet-500/25 text-violet-300',
      dot: 'bg-violet-400 shadow-[0_0_8px_#8B5CF6]',
    },
    cyan: {
      bg: 'bg-cyan-500/10 border-cyan-500/25 text-cyan-300',
      dot: 'bg-cyan-400 shadow-[0_0_8px_#06B6D4]',
    },
    amber: {
      bg: 'bg-amber-500/10 border-amber-500/25 text-amber-300',
      dot: 'bg-amber-400 shadow-[0_0_8px_#F59E0B]',
    },
    emerald: {
      bg: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300',
      dot: 'bg-emerald-400 shadow-[0_0_8px_#10B981]',
    },
    rose: {
      bg: 'bg-rose-500/10 border-rose-500/25 text-rose-300',
      dot: 'bg-rose-400 shadow-[0_0_8px_#F43F5E]',
    },
    slate: {
      bg: 'bg-slate-500/10 border-slate-500/20 text-slate-300',
      dot: 'bg-slate-400',
    },
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-full font-medium',
    md: 'text-xs px-2.5 py-1 rounded-full font-medium',
  };

  const style = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 border backdrop-blur-md ${style.bg} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />}
      {children}
    </span>
  );
};
