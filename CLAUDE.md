# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based implementation of the classic Vexed puzzle game. The game involves moving blocks horizontally to eliminate matching blocks through adjacency, with gravity physics applied.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build
- `npm run lint` - Run ESLint on codebase
- `npm run preview` - Preview production build

## Architecture

### Game Structure
- **10×8 game board** - 10 blocks wide, 8 blocks tall, 40×40px blocks with spacing
- **Block types**: 9 total types (block1.svg - block9.svg in assets/)
  - Types 1-8: Movable blocks that eliminate when matching blocks touch
  - Type 9: Immovable obstacle blocks
- **Level system**: 59 levels loaded from text files (level.1 - level.59 in assets/)

### Level Data Format
Level files contain 8 rows × 10 columns of digits:
- `0` = empty space
- `1-8` = movable block types (corresponding to block1.svg - block8.svg)
- `9` = immovable block (block9.svg)

### Game Rules Implementation
- **Movement**: Blocks move only to immediately adjacent horizontal positions
- **Gravity**: Blocks fall when not supported
- **Elimination**: 2+ adjacent blocks of same type eliminate automatically
- **Win condition**: Clear all movable blocks (types 1-8) from level

### Suggested Component Architecture (from requirements.md)
```
App/
├── GameBoard/           # Main game container
├── GameDisplay/         # Visual game board  
├── ControlPanel/        # UI controls (level, restart, next)
├── Block/              # Individual block component
└── LevelLoader/        # Level file management
```

### State Management Requirements
- Game state: Current board configuration (10×8 block array)
- UI state: Current level (1-59), remaining movable block count
- Animation state: Movement and elimination tracking
- Game status: 'playing' | 'completed' | 'loading'

## Key Technical Constraints

- **Single block movement**: Only one block moves at a time, only to adjacent positions
- **Animation sequencing**: Must wait for animations to complete before accepting new input
- **Performance target**: 60 FPS animations, <100ms move response time
- **Mobile support**: Touch-friendly drag controls
- **Responsive design**: Scalable block sizes for different screen sizes

## Code Standards

- Modern JavaScript (ES6+)
- React functional components with hooks
- ESLint configuration already set up with React rules
- No TypeScript - uses JavaScript with PropTypes if needed
- Clean, maintainable code without over-engineering