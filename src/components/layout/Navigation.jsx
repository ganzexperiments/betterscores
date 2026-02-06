import { NavLink } from 'react-router-dom';

export const Navigation = () => {
  const navItems = [
    { to: '/', label: 'Scores' },
    { to: '/standings', label: 'Standings' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-slate-100 tracking-tight">
              Courtside
            </h1>
          </div>

          {/* Nav Items */}
          <div className="flex gap-8" data-test="nav-links">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `relative py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-slate-100'
                      : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
