function FinalVictoryOverlay({ onPlayAgain }) {
  return (
    <div className="final-victory-overlay fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50">
      <div className="final-victory-backdrop absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      <div className="final-victory-content relative bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white rounded-3xl shadow-2xl p-8 md:p-16 text-center max-w-lg mx-4">
        {/* Confetti Animation */}
        <div className="confetti-container absolute inset-0 overflow-hidden rounded-3xl">
          <div className="confetti confetti-1"></div>
          <div className="confetti confetti-2"></div>
          <div className="confetti confetti-3"></div>
          <div className="confetti confetti-4"></div>
          <div className="confetti confetti-5"></div>
          <div className="confetti confetti-6"></div>
        </div>
        
        {/* Victory Icon */}
        <div className="text-8xl md:text-9xl mb-6 animate-bounce relative z-10">
          🏆
        </div>
        
        {/* Victory Message */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">
          🎉 Congratulations! 🎉
        </h1>
        
        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-pink-100 relative z-10">
          You've completed all 59 levels!
        </h2>
        
        <p className="text-lg md:text-xl mb-8 text-pink-50 leading-relaxed relative z-10">
          You are a true Vexed master! 🌟<br/>
          Ready for another challenge?
        </p>
        
        {/* Achievement Badge */}
        <div className="bg-white/20 rounded-2xl p-4 mb-8 relative z-10">
          <div className="text-pink-100 text-sm font-medium mb-1">
            ACHIEVEMENT UNLOCKED
          </div>
          <div className="text-white text-lg font-bold">
            🎯 Puzzle Master
          </div>
          <div className="text-pink-100 text-sm">
            Completed all 59 levels
          </div>
        </div>
        
        {/* Play Again Button */}
        <button 
          onClick={onPlayAgain}
          className="play-again-btn px-8 py-4 md:px-10 md:py-5 bg-white text-purple-600 font-bold text-lg md:text-xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 relative z-10"
        >
          🚀 Play Again
        </button>
        
        <p className="text-pink-100 text-sm mt-4 relative z-10">
          Start from Level 1
        </p>
      </div>
    </div>
  );
}

export default FinalVictoryOverlay;