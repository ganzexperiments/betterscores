export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-white/10 text-slate-200',
    live: 'bg-green-500/10 text-green-500 border border-green-500/20',
    ranked: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    final: 'bg-slate-800/50 text-slate-400 border border-white/5',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
