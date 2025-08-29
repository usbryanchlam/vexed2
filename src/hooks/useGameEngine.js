import { useState, useEffect, useCallback } from "react";

export const useGameEngine = () => {
  const [board, setBoard] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [movableBlockCount, setMovableBlockCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameStatus, setGameStatus] = useState("playing"); // 'playing', 'completed'

  // Check for adjacent matching blocks and eliminate them
  const eliminateBlocks = useCallback((currentBoard) => {
    const newBoard = currentBoard.map((row) => [...row]);
    let eliminatedCount = 0;
    const toEliminate = new Set();

    // Function to find all connected blocks of the same type
    const findConnectedBlocks = (row, col, blockType, visited) => {
      const key = `${row}-${col}`;
      if (visited.has(key) || row < 0 || row >= 8 || col < 0 || col >= 10) {
        return [];
      }

      const cell = newBoard[row][col];
      if (cell.type !== blockType || cell.type === 0 || cell.type === 9) {
        return [];
      }

      visited.add(key);
      const connected = [{ row, col }];

      // Check all 4 directions (up, down, left, right)
      const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];

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
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 10; col++) {
        const cell = newBoard[row][col];
        const key = `${row}-${col}`;

        if (!visited.has(key) && cell.type >= 1 && cell.type <= 8) {
          const connectedBlocks = findConnectedBlocks(
            row,
            col,
            cell.type,
            visited
          );

          // If 2 or more blocks are connected, mark them for elimination
          if (connectedBlocks.length >= 2) {
            connectedBlocks.forEach(({ row, col }) => {
              toEliminate.add(`${row}-${col}`);
            });
          }
        }
      }
    }

    // Remove the marked blocks
    toEliminate.forEach((key) => {
      const [row, col] = key.split("-").map(Number);
      newBoard[row][col] = {
        type: 0,
        id: `${row}-${col}`,
      };
      eliminatedCount++;
    });

    return { newBoard, eliminatedCount };
  }, []);

  // Apply gravity to make unsupported blocks fall
  const applyGravity = useCallback((currentBoard) => {
    const newBoard = currentBoard.map((row) => [...row]);
    let hasChanges = false;

    // Check each column from bottom to top
    for (let col = 0; col < 10; col++) {
      for (let row = 6; row >= 0; row--) {
        // Start from second-to-last row
        const cell = newBoard[row][col];

        // If there's a movable block (types 1-8) that's not supported
        if (cell.type >= 1 && cell.type <= 8) {
          // Find the lowest position it can fall to
          let targetRow = row;

          for (let checkRow = row + 1; checkRow < 8; checkRow++) {
            if (newBoard[checkRow][col].type === 0) {
              targetRow = checkRow;
            } else {
              break; // Hit a block, can't fall further
            }
          }

          // If the block can fall
          if (targetRow > row) {
            // Move the block down
            newBoard[targetRow][col] = {
              ...cell,
              id: `${targetRow}-${col}`,
            };

            // Clear the original position
            newBoard[row][col] = {
              type: 0,
              id: `${row}-${col}`,
            };

            hasChanges = true;
          }
        }
      }
    }

    return { newBoard, hasChanges };
  }, []);

  // Load level data from text file
  const loadLevel = useCallback(async (levelNumber) => {
    try {
      setLoading(true);
      setGameStatus("playing");
      const response = await fetch(`/assets/level.${levelNumber}`);
      const levelData = await response.text();

      // Parse level data into board
      const lines = levelData.trim().split("\n");
      const newBoard = [];
      let movableCount = 0;

      for (let row = 0; row < 8; row++) {
        const boardRow = [];
        const line = lines[row] || "0000000000"; // fallback for missing rows

        for (let col = 0; col < 10; col++) {
          const type = parseInt(line[col] || "0");
          boardRow.push({
            type: type,
            id: `${row}-${col}`,
          });

          // Count movable blocks (types 1-8)
          if (type >= 1 && type <= 8) {
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

        // Apply elimination first
        const eliminationResult = eliminateBlocks(finalBoard);
        finalBoard = eliminationResult.newBoard;

        if (eliminationResult.eliminatedCount > 0) {
          totalEliminated += eliminationResult.eliminatedCount;
          console.log(
            `${eliminationResult.eliminatedCount} blocks eliminated on level load`
          );
          hasPhysicsChanges = true;
        }

        // Then apply gravity
        let gravityResult;
        do {
          gravityResult = applyGravity(finalBoard);
          finalBoard = gravityResult.newBoard;
          if (gravityResult.hasChanges) {
            console.log("Gravity applied on level load");
            hasPhysicsChanges = true;
          }
        } while (gravityResult.hasChanges);
      }

      setBoard(finalBoard);
      setMovableBlockCount(movableCount - totalEliminated);
      setLoading(false);
    } catch (error) {
      console.error("Error loading level:", error);
      setLoading(false);
    }
  }, [eliminateBlocks, applyGravity]);

  // Handle block movement
  const handleBlockMove = useCallback((fromRow, fromCol, toRow, toCol) => {
    // Check if the target position is empty
    if (board[toRow][toCol].type !== 0) {
      console.log("Target position is not empty");
      return false;
    }

    console.log(
      `Moving block from (${fromRow}, ${fromCol}) to (${toRow}, ${toCol})`
    );

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
      type: 0,
      id: `${fromRow}-${fromCol}`,
    };

    // Apply physics: gravity and elimination in a loop until stable
    let totalEliminated = 0;
    let hasPhysicsChanges = true;

    while (hasPhysicsChanges) {
      hasPhysicsChanges = false;

      // Apply gravity first
      let gravityResult;
      do {
        gravityResult = applyGravity(newBoard);
        newBoard = gravityResult.newBoard;
        if (gravityResult.hasChanges) {
          console.log("Gravity applied");
          hasPhysicsChanges = true;
        }
      } while (gravityResult.hasChanges);

      // Then check for block elimination
      const eliminationResult = eliminateBlocks(newBoard);
      newBoard = eliminationResult.newBoard;

      if (eliminationResult.eliminatedCount > 0) {
        totalEliminated += eliminationResult.eliminatedCount;
        console.log(`${eliminationResult.eliminatedCount} blocks eliminated`);
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
      console.log("🎉 Level completed!");
    }

    setBoard(newBoard);
    return true;
  }, [board, movableBlockCount, applyGravity, eliminateBlocks]);

  // Load initial level
  useEffect(() => {
    loadLevel(currentLevel);
  }, [currentLevel, loadLevel]);

  const handleRestart = useCallback(() => {
    loadLevel(currentLevel);
  }, [currentLevel, loadLevel]);

  const handleNextLevel = useCallback(() => {
    if (currentLevel < 59) {
      setCurrentLevel(currentLevel + 1);
    }
  }, [currentLevel]);

  return {
    // State
    board,
    currentLevel,
    movableBlockCount,
    loading,
    gameStatus,
    
    // Actions
    handleBlockMove,
    handleRestart,
    handleNextLevel,
  };
};