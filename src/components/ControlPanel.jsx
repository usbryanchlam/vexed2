import { MAX_LEVEL, INITIAL_LEVEL } from "../constants/gameConstants";

function ControlPanel({ 
  currentLevel, 
  movableBlockCount, 
  onRestart, 
  onNextLevel,
  onPreviousLevel, 
  maxLevel = MAX_LEVEL 
}) {
  return (
    <div className="text-center space-y-2 md:space-y-4">
      <div className="flex gap-4 md:gap-8 justify-center mb-2 md:mb-4 flex-wrap">
        <span className="font-medium px-3 py-1 md:px-4 md:py-2 bg-slate-200 rounded-lg text-slate-700 text-sm md:text-base">
          Level: {currentLevel}
        </span>
        <span className="font-medium px-3 py-1 md:px-4 md:py-2 bg-slate-200 rounded-lg text-slate-700 text-sm md:text-base">
          Blocks: {movableBlockCount}
        </span>
      </div>
      
      <div className="flex gap-3 md:gap-4 justify-center flex-wrap">
        <button
          onClick={onPreviousLevel}
          disabled={currentLevel <= INITIAL_LEVEL}
          className="px-4 py-2 md:px-6 md:py-3 !bg-purple-600 hover:!bg-purple-700 active:!bg-purple-800 disabled:!bg-gray-400 disabled:cursor-not-allowed !text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:transform-none text-sm md:text-base !border-0 min-h-[40px] md:min-h-[48px]"
          style={{
            backgroundColor: currentLevel <= INITIAL_LEVEL ? "#9ca3af" : "#9333ea",
            color: "white",
            border: "none",
          }}
        >
          Previous Level
        </button>
        <button
          onClick={onRestart}
          className="px-4 py-2 md:px-6 md:py-3 !bg-blue-600 hover:!bg-blue-700 active:!bg-blue-800 !text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-sm md:text-base !border-0 min-h-[40px] md:min-h-[48px]"
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
          }}
        >
          Restart
        </button>
        <button
          onClick={onNextLevel}
          disabled={currentLevel >= maxLevel}
          className="px-4 py-2 md:px-6 md:py-3 !bg-green-600 hover:!bg-green-700 active:!bg-green-800 disabled:!bg-gray-400 disabled:cursor-not-allowed !text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:transform-none text-sm md:text-base !border-0 min-h-[40px] md:min-h-[48px]"
          style={{
            backgroundColor: currentLevel >= maxLevel ? "#9ca3af" : "#16a34a",
            color: "white",
            border: "none",
          }}
        >
          Next Level
        </button>
      </div>
    </div>
  );
}

export default ControlPanel;