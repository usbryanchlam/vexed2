// Game Board Configuration
export const BOARD_WIDTH = 10; // Number of columns in the game board
export const BOARD_HEIGHT = 8; // Number of rows in the game board

// Block Types
export const BLOCK_TYPES = {
  EMPTY: 0,
  MOVABLE_MIN: 1,
  MOVABLE_MAX: 8,
  IMMOVABLE: 9,
};

// Game Configuration
export const MAX_LEVEL = 59; // Maximum level in the game
export const INITIAL_LEVEL = 1; // Starting level
export const AUTO_PROGRESS_SECONDS = 5; // Seconds before auto-advancing to next level after victory

// Movement Rules
export const ADJACENT_DISTANCE = 1; // Distance for valid adjacent moves
export const MIN_BLOCKS_FOR_ELIMINATION = 2; // Minimum connected blocks needed for elimination

// Animation Timings (in milliseconds)
export const ANIMATION_TIMINGS = {
  GRAVITY_STEP: 400, // Time between gravity animation steps
  ELIMINATION_HIGHLIGHT: 300, // Duration for highlighting blocks before elimination
  ELIMINATION_DURATION: 600, // Duration of elimination animation
  ELIMINATION_STAGGER: 80, // Delay between staggered eliminations
  HORIZONTAL_MOVE_DELAY: 300, // Delay after horizontal move before gravity
};

// Grid Navigation Directions (up, down, left, right)
export const DIRECTIONS = [
  [-1, 0], // Up
  [1, 0],  // Down
  [0, -1], // Left
  [0, 1],  // Right
];