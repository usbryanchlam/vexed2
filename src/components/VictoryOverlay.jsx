function VictoryOverlay({ 
  currentLevel, 
  autoProgressTimer, 
  totalDuration = 5,
  onClose 
}) {
  return (
    <div className="victory-overlay fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50">
      <div className="victory-backdrop absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      
      <div className="victory-content relative bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white rounded-2xl shadow-2xl p-8 md:p-12 text-center max-w-md mx-4">
        {/* Victory Icon */}
        <div className="text-6xl md:text-8xl mb-4 animate-bounce">
          🎉
        </div>
        
        {/* Victory Message */}
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Level Complete!
        </h2>
        
        <p className="text-emerald-50 text-lg md:text-xl mb-6">
          All blocks eliminated!
        </p>
        
        {/* Current Level Info */}
        <div className="bg-white/20 rounded-lg p-3 mb-6">
          <div className="text-emerald-50 text-sm font-medium">
            Level {currentLevel} Complete
          </div>
        </div>
        
        {/* Auto Progress Timer */}
        <div className="space-y-3">
          <div className="text-emerald-50 text-base">
            Next level in...
          </div>
          
          <div className="timer-circle relative inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full">
            <span className="text-2xl font-bold timer-number">
              {autoProgressTimer}
            </span>
            {/* Animated progress ring */}
            <svg className="timer-ring absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
              <circle 
                cx="32" 
                cy="32" 
                r="28" 
                fill="none" 
                stroke="rgba(255,255,255,0.3)" 
                strokeWidth="4"
              />
              <circle 
                cx="32" 
                cy="32" 
                r="28" 
                fill="none" 
                stroke="white" 
                strokeWidth="4" 
                strokeLinecap="round"
                className="timer-progress"
                style={{
                  strokeDasharray: '176',
                  strokeDashoffset: `${176 * (1 - (totalDuration - autoProgressTimer) / totalDuration)}`,
                  transition: 'stroke-dashoffset 1s linear'
                }}
              />
            </svg>
          </div>
        </div>
        
        {/* Optional close button for manual control */}
        {onClose && (
          <button 
            onClick={onClose}
            className="mt-4 text-emerald-50 hover:text-white text-sm underline transition-colors"
          >
            Skip to next level
          </button>
        )}
      </div>
    </div>
  );
}

export default VictoryOverlay;