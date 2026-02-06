export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  ...props 
}) => {
  const variants = {
    primary: 'bg-blue-500 text-white border border-blue-500 hover:bg-blue-600',
    secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700',
    outline: 'bg-transparent border border-white/20 text-slate-300 hover:border-white/40 hover:bg-white/5',
    ghost: 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-xs font-medium tracking-wide',
    md: 'px-6 py-2 text-sm font-medium',
    lg: 'px-8 py-3 text-base font-medium',
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
