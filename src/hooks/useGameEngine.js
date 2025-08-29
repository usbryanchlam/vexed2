import { useState, useEffect, useCallback } from "react";
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  BLOCK_TYPES,
  MAX_LEVEL,
  INITIAL_LEVEL,
  AUTO_PROGRESS_SECONDS,
  MIN_BLOCKS_FOR_ELIMINATION,
  ANIMATION_TIMINGS,
  DIRECTIONS,
} from "../constants/gameConstants";

export const useGameEngine = () => {
  const [board, setBoard] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(INITIAL_LEVEL);
  const [movableBlockCount, setMovableBlockCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameStatus, setGameStatus] = useState("playing"); // 'playing', 'completed'
  const [animating, setAnimating] = useState(false); // Prevent input during animations
  const [showVictoryOverlay, setShowVictoryOverlay] = useState(false);
  const [showFinalVictoryOverlay, setShowFinalVictoryOverlay] = useState(false);
  const [autoProgressTimer, setAutoProgressTimer] = useState(AUTO_PROGRESS_SECONDS);

  // Check for adjacent matching blocks and eliminate them
  const eliminateBlocks = useCallback((currentBoard) => {
    const newBoard = currentBoard.map((row) => [...row]);
    let eliminatedCount = 0;
    const toEliminate = new Set();
    const toHighlight = new Set(); // For chain reaction highlighting

    // Function to find all connected blocks of the same type
    const findConnectedBlocks = (row, col, blockType, visited) => {
      const key = `${row}-${col}`;
      if (visited.has(key) || row < 0 || row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH) {
        return [];
      }

      const cell = newBoard[row][col];
      if (cell.type !== blockType || cell.type === BLOCK_TYPES.EMPTY || cell.type === BLOCK_TYPES.IMMOVABLE) {
        return [];
      }

      visited.add(key);
      const connected = [{ row, col }];

      // Check all 4 directions (up, down, left, right)
      const directions = DIRECTIONS;

      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        connected.push(
          ...findConnectedBlocks(newRow, newCol, blockType, visited)
        );
      }

      return connected;
    };

    // Find all groups of connected blocks
    const visited = new Set();
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        const cell = newBoard[row][col];
        const key = `${row}-${col}`;

        if (!visited.has(key) && cell.type >= BLOCK_TYPES.MOVABLE_MIN && cell.type <= BLOCK_TYPES.MOVABLE_MAX) {
          const connectedBlocks = findConnectedBlocks(
            row,
            col,
            cell.type,
            visited
          );

          // If 2 or more blocks are connected, mark them for elimination
          if (connectedBlocks.length >= MIN_BLOCKS_FOR_ELIMINATION) {
            connectedBlocks.forEach(({ row, col }) => {
              toEliminate.add(`${row}-${col}`);
              toHighlight.add(`${row}-${col}`);
            });
          }
        }
      }
    }

    // First, mark blocks for elimination with visual states
    toEliminate.forEach((key) => {
      const [row, col] = key.split("-").map(Number);
      newBoard[row][col] = {
        ...newBoard[row][col],
        eliminating: true,
      };
      eliminatedCount++;
    });

    return { newBoard, eliminatedCount, toEliminate };
  }, []);

  // Handle visual elimination with animations
  const eliminateBlocksWithAnimation = useCallback(async (currentBoard) => {
    const eliminationResult = eliminateBlocks(currentBoard);
    let newBoard = eliminationResult.newBoard;

    if (eliminationResult.eliminatedCount > 0) {
      // Phase 1: Highlight connected blocks
      const highlightBoard = currentBoard.map((row) => [...row]);
      eliminationResult.toEliminate.forEach((key) => {
        const [row, col] = key.split("-").map(Number);
        highlightBoard[row][col] = {
          ...highlightBoard[row][col],
          highlighting: true,
        };
      });
      
      setBoard(highlightBoard);
      await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIMINGS.ELIMINATION_HIGHLIGHT)); // Highlight duration
      
      // Phase 2: Staggered elimination animation
      const eliminationOrder = Array.from(eliminationResult.toEliminate);
      
      // Sort blocks by position for cascade effect (left to right, top to bottom)
      eliminationOrder.sort((a, b) => {
        const [aRow, aCol] = a.split("-").map(Number);
        const [bRow, bCol] = b.split("-").map(Number);
        if (aRow === bRow) return aCol - bCol; // Same row: left to right
        return aRow - bRow; // Different row: top to bottom
      });
      
      // Start elimination animations with staggered timing
      const staggeredBoard = highlightBoard.map((row) => [...row]);
      eliminationOrder.forEach((key, index) => {
        const [row, col] = key.split("-").map(Number);
        staggeredBoard[row][col] = {
          ...staggeredBoard[row][col],
          highlighting: false,
          eliminating: true,
          eliminationDelay: index * ANIMATION_TIMINGS.ELIMINATION_STAGGER, // Stagger between blocks
        };
      });
      
      setBoard(staggeredBoard);
      
      // Wait for all eliminations to complete (base duration + stagger for last block)
      const totalDuration = ANIMATION_TIMINGS.ELIMINATION_DURATION + (eliminationOrder.length - 1) * ANIMATION_TIMINGS.ELIMINATION_STAGGER;
      await new Promise((resolve) => setTimeout(resolve, totalDuration));
      
      // Phase 3: Actually remove the blocks
      eliminationResult.toEliminate.forEach((key) => {
        const [row, col] = key.split("-").map(Number);
        newBoard[row][col] = {
          type: 0,
          id: `${row}-${col}`,
        };
      });
      
      setBoard(newBoard);
    }

    return { 
      newBoard, 
      eliminatedCount: eliminationResult.eliminatedCount 
    };
  }, [eliminateBlocks]);

  // Apply gravity to make blocks fall one step at a time
  const applyGravity = useCallback((currentBoard) => {
    const newBoard = currentBoard.map((row) => [...row]);
    let hasChanges = false;

    // Check each column from bottom to top
    for (let col = 0; col < BOARD_WIDTH; col++) {
      for (let row = BOARD_HEIGHT - 2; row >= 0; row--) {
        // Start from second-to-last row
        const cell = newBoard[row][col];

        // If there's a movable block (types 1-8) that's not supported
        if (cell.type >= BLOCK_TYPES.MOVABLE_MIN && cell.type <= BLOCK_TYPES.MOVABLE_MAX) {
          // Check if the block can fall one row down
          const nextRow = row + 1;

          if (nextRow < BOARD_HEIGHT && newBoard[nextRow][col].type === BLOCK_TYPES.EMPTY) {
            // Move the block down by one row only
            newBoard[nextRow][col] = {
              ...cell,
              id: `${nextRow}-${col}`,
            };

            // Clear the original position
            newBoard[row][col] = {
              type: BLOCK_TYPES.EMPTY,
              id: `${row}-${col}`,
            };

            hasChanges = true;
          }
        }
      }
    }

    return { newBoard, hasChanges };
  }, []);

  // Apply gravity with step-by-step animation
  const applyGravityWithAnimation = useCallback(
    async (currentBoard) => {
      let workingBoard = currentBoard;
      let hasMoreFalling = true;

      setAnimating(true);

      try {
        while (hasMoreFalling) {
          const gravityResult = applyGravity(workingBoard);
          workingBoard = gravityResult.newBoard;

          if (gravityResult.hasChanges) {
            // Update the board state and wait for animation
            setBoard(workingBoard);
            await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIMINGS.GRAVITY_STEP)); // Wait for CSS transition
          } else {
            hasMoreFalling = false;
          }
        }
      } catch {
        // Handle gravity animation errors silently
      } finally {
        setAnimating(false);
      }

      return workingBoard;
    },
    [applyGravity]
  );

  // Load level data from text file
  const loadLevel = useCallback(
    async (levelNumber) => {
      try {
        setLoading(true);
        setGameStatus("playing");
        setShowVictoryOverlay(false);
        setShowFinalVictoryOverlay(false);
        setAutoProgressTimer(AUTO_PROGRESS_SECONDS);
        const response = await fetch(`/assets/level.${levelNumber}`);
        const levelData = await response.text();

        // Parse level data into board
        const lines = levelData.trim().split("\n");
        const newBoard = [];
        let movableCount = 0;

        for (let row = 0; row < BOARD_HEIGHT; row++) {
          const boardRow = [];
          const line = lines[row] || "0".repeat(BOARD_WIDTH); // fallback for missing rows

          for (let col = 0; col < BOARD_WIDTH; col++) {
            const type = parseInt(line[col] || "0");
            boardRow.push({
              type: type,
              id: `${row}-${col}`,
            });

            // Count movable blocks (types 1-8)
            if (type >= BLOCK_TYPES.MOVABLE_MIN && type <= BLOCK_TYPES.MOVABLE_MAX) {
              movableCount++;
            }
          }
          newBoard.push(boardRow);
        }

        // Apply elimination and gravity after loading level
        let finalBoard = newBoard;
        let totalEliminated = 0;
        let hasPhysicsChanges = true;

        while (hasPhysicsChanges) {
          hasPhysicsChanges = false;

          // Apply elimination first (instant during level load)
          const eliminationResult = eliminateBlocks(finalBoard);
          finalBoard = eliminationResult.newBoard;

          if (eliminationResult.eliminatedCount > 0) {
            // Instantly remove blocks during level load (no animation)
            eliminationResult.toEliminate.forEach((key) => {
              const [row, col] = key.split("-").map(Number);
              finalBoard[row][col] = {
                type: BLOCK_TYPES.EMPTY,
                id: `${row}-${col}`,
              };
            });
            
            totalEliminated += eliminationResult.eliminatedCount;
            hasPhysicsChanges = true;
          }

          // Then apply gravity
          let gravityResult;
          do {
            gravityResult = applyGravity(finalBoard);
            finalBoard = gravityResult.newBoard;
            if (gravityResult.hasChanges) {
              hasPhysicsChanges = true;
            }
          } while (gravityResult.hasChanges);
        }

        setBoard(finalBoard);
        setMovableBlockCount(movableCount - totalEliminated);
        setLoading(false);
      } catch {
        // Handle level loading errors silently
        setLoading(false);
      }
    },
    [eliminateBlocks, applyGravity]
  );

  // Handle block movement
  const handleBlockMove = useCallback(
    async (fromRow, fromCol, toRow, toCol) => {
      // Prevent moves during animations
      if (animating) {
        return false;
      }

      // Check if the target position is empty
      if (board[toRow][toCol].type !== BLOCK_TYPES.EMPTY) {
        return false;
      }

      // Create new board with the moved block
      let newBoard = board.map((row) => [...row]);
      const movingBlock = newBoard[fromRow][fromCol];

      // Move the block
      newBoard[toRow][toCol] = {
        ...movingBlock,
        id: `${toRow}-${toCol}`,
      };

      // Clear the original position
      newBoard[fromRow][fromCol] = {
        type: BLOCK_TYPES.EMPTY,
        id: `${fromRow}-${fromCol}`,
      };

      // First update board with the horizontal move
      setBoard(newBoard);

      // Wait for horizontal animation to be visible before starting gravity
      await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIMINGS.HORIZONTAL_MOVE_DELAY));

      // Apply animated gravity and elimination in a loop until stable
      let totalEliminated = 0;
      let hasPhysicsChanges = true;

      while (hasPhysicsChanges) {
        hasPhysicsChanges = false;

        // Apply animated gravity first
        newBoard = await applyGravityWithAnimation(newBoard);

        // Then check for block elimination with animation
        const eliminationResult = await eliminateBlocksWithAnimation(newBoard);
        newBoard = eliminationResult.newBoard;

        if (eliminationResult.eliminatedCount > 0) {
          totalEliminated += eliminationResult.eliminatedCount;
          hasPhysicsChanges = true;
        }
      }

      // Update movable block count and check for victory
      const newMovableCount = movableBlockCount - totalEliminated;
      if (totalEliminated > 0) {
        setMovableBlockCount(newMovableCount);
      }

      // Check for victory condition
      if (newMovableCount === 0) {
        setGameStatus("completed");
        
        // Check if this is the final level
        if (currentLevel === MAX_LEVEL) {
          setShowFinalVictoryOverlay(true);
        } else {
          setShowVictoryOverlay(true);
          setAutoProgressTimer(AUTO_PROGRESS_SECONDS);

          // Start auto-progress timer
          let timeLeft = AUTO_PROGRESS_SECONDS;
          const timer = setInterval(() => {
            timeLeft--;
            setAutoProgressTimer(timeLeft);

            if (timeLeft <= 0) {
              clearInterval(timer);
              setShowVictoryOverlay(false);
              setAutoProgressTimer(AUTO_PROGRESS_SECONDS);
              if (currentLevel < MAX_LEVEL) {
                setCurrentLevel(currentLevel + 1);
              }
            }
          }, 1000);
        }
      }

      return true;
    },
    [
      board,
      movableBlockCount,
      applyGravityWithAnimation,
      eliminateBlocksWithAnimation,
      animating,
      currentLevel,
    ]
  );

  // Load initial level
  useEffect(() => {
    loadLevel(currentLevel);
  }, [currentLevel, loadLevel]);

  const handleRestart = useCallback(() => {
    loadLevel(currentLevel);
  }, [currentLevel, loadLevel]);

  const handleNextLevel = useCallback(() => {
    if (currentLevel < MAX_LEVEL) {
      setCurrentLevel(currentLevel + 1);
    }
  }, [currentLevel]);

  const handleCloseVictoryOverlay = useCallback(() => {
    setShowVictoryOverlay(false);
    setAutoProgressTimer(AUTO_PROGRESS_SECONDS);
    if (currentLevel < MAX_LEVEL) {
      setCurrentLevel(currentLevel + 1);
    }
  }, [currentLevel]);

  const handlePlayAgain = useCallback(() => {
    setShowFinalVictoryOverlay(false);
    setShowVictoryOverlay(false);
    setGameStatus("playing");
    setCurrentLevel(INITIAL_LEVEL);
  }, []);

  return {
    // State
    board,
    currentLevel,
    movableBlockCount,
    loading,
    gameStatus,
    animating,
    showVictoryOverlay,
    showFinalVictoryOverlay,
    autoProgressTimer,

    // Actions
    handleBlockMove,
    handleRestart,
    handleNextLevel,
    handleCloseVictoryOverlay,
    handlePlayAgain,
  };
};
