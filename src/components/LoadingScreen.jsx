function LoadingScreen({ currentLevel }) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="text-xl md:text-2xl font-semibold text-slate-700 animate-pulse text-center">
          Loading level {currentLevel}...
        </div>
        <div className="mt-4 w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

export default LoadingScreen;
