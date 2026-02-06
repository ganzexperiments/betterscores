export const PageWrapper = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {title && (
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-100">
              {title}
            </h1>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
