import { useGameEngine, AUTO_PROGRESS_SECONDS } from "./hooks/useGameEngine";
import ControlPanel from "./components/ControlPanel";
import GameBoard from "./components/GameBoard";
import LoadingScreen from "./components/LoadingScreen";
import VictoryOverlay from "./components/VictoryOverlay";
import "./App.css";

function App() {
  const {
    board,
    currentLevel,
    movableBlockCount,
    loading,
    gameStatus,
    showVictoryOverlay,
    autoProgressTimer,
    handleBlockMove,
    handleRestart,
    handleNextLevel,
    handleCloseVictoryOverlay,
  } = useGameEngine();

  if (loading) {
    return <LoadingScreen currentLevel={currentLevel} />;
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 md:gap-8 p-2 md:p-4 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <h1 className="text-2xl md:text-4xl font-bold text-slate-800 mb-3 md:mb-6">
          Vexed Puzzle Game
        </h1>

        <GameBoard board={board} onBlockMove={handleBlockMove} />

        <ControlPanel
          currentLevel={currentLevel}
          movableBlockCount={movableBlockCount}
          gameStatus={gameStatus}
          onRestart={handleRestart}
          onNextLevel={handleNextLevel}
        />
        
        {showVictoryOverlay && (
          <VictoryOverlay
            currentLevel={currentLevel}
            autoProgressTimer={autoProgressTimer}
            totalDuration={AUTO_PROGRESS_SECONDS}
            onClose={handleCloseVictoryOverlay}
          />
        )}
      </div>
    </div>
  );
}

export default App;
