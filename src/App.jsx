import { useGameEngine } from "./hooks/useGameEngine";
import { AUTO_PROGRESS_SECONDS } from "./constants/gameConstants";
import ControlPanel from "./components/ControlPanel";
import GameBoard from "./components/GameBoard";
import LoadingScreen from "./components/LoadingScreen";
import VictoryOverlay from "./components/VictoryOverlay";
import FinalVictoryOverlay from "./components/FinalVictoryOverlay";
import "./App.css";

function App() {
  const {
    board,
    currentLevel,
    movableBlockCount,
    loading,
    showVictoryOverlay,
    showFinalVictoryOverlay,
    autoProgressTimer,
    handleBlockMove,
    handleRestart,
    handleNextLevel,
    handlePreviousLevel,
    handleCloseVictoryOverlay,
    handlePlayAgain,
  } = useGameEngine();

  if (loading) {
    return <LoadingScreen currentLevel={currentLevel} />;
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 md:gap-8 p-2 md:p-4 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-6">
          <span className="text-red-500">V</span>
          <span className="text-orange-500">e</span>
          <span className="text-yellow-500">x</span>
          <span className="text-green-500">e</span>
          <span className="text-blue-500">d</span>
        </h1>

        <GameBoard board={board} onBlockMove={handleBlockMove} />

        <ControlPanel
          currentLevel={currentLevel}
          movableBlockCount={movableBlockCount}
          onRestart={handleRestart}
          onNextLevel={handleNextLevel}
          onPreviousLevel={handlePreviousLevel}
        />
        
        {showVictoryOverlay && (
          <VictoryOverlay
            currentLevel={currentLevel}
            autoProgressTimer={autoProgressTimer}
            totalDuration={AUTO_PROGRESS_SECONDS}
            onClose={handleCloseVictoryOverlay}
          />
        )}
        
        {showFinalVictoryOverlay && (
          <FinalVictoryOverlay
            onPlayAgain={handlePlayAgain}
          />
        )}
      </div>
    </div>
  );
}

export default App;
