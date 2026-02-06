export const Skeleton = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'h-4 w-full',
    card: 'h-32 w-full rounded-2xl',
    circle: 'h-12 w-12 rounded-full',
    text: 'h-3 w-3/4',
  };

  return (
    <div
      className={`animate-pulse bg-white/10 ${variants[variant]} ${className}`}
    />
  );
};

export const GameCardSkeleton = () => (
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 overflow-hidden relative">
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-white/10 rounded w-24" />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full" />
            <div className="h-6 bg-white/10 rounded w-16" />
          </div>
          <div className="h-10 bg-white/10 rounded w-12" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full" />
            <div className="h-6 bg-white/10 rounded w-16" />
          </div>
          <div className="h-10 bg-white/10 rounded w-12" />
        </div>
      </div>
    </div>
    
    {/* Shimmer effect */}
    <div 
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"
    />
  </div>
);

export const StatCardSkeleton = ({ variant = 'standard' }) => {
  const heights = {
    hero: 'h-32',
    standard: 'h-24',
    compact: 'h-20',
  };
  
  return (
    <div className={`bg-white/10 rounded-2xl p-4 ${heights[variant]}`}>
      <Skeleton variant="text" className="w-20 h-3 mb-3 bg-white/20" />
      <Skeleton className="w-16 h-8 bg-white/20" />
    </div>
  );
};
