# Vexed Puzzle Game - Requirements Specification

## Project Overview

This document outlines the requirements for developing a modern web-based version of the classic Vexed puzzle game using React.js and Tailwind CSS. The game is a block-based puzzle where players move blocks to eliminate them by making matching blocks touch each other.

## Technical Stack

- **Frontend Framework**: React.js 19.1.1 (JavaScript)
- **Styling**: Tailwind CSS 4.1.12
- **Build Tool**: Vite 7.1.2
- **Package Manager**: npm
- **Linting**: ESLint 9.33.0 with React hooks support

## Game Overview

Vexed is a block elimination puzzle game where:

- Players move pattern blocks horizontally to make matching blocks touch
- When 2+ blocks of the same type touch, they are eliminated
- Gravity applies - blocks fall when not supported
- Goal: Clear all movable blocks from each level

## Functional Requirements

### 1. Core Game Mechanics

#### 1.1 Game Board

- **Dimensions**: 10 blocks wide × 8 blocks tall
- **Block Size**: 40×40 pixels (scalable for responsive design)
  Make some space between the blocks for better visualation

#### 1.2 Block Types

- **Movable Blocks**: 8 different types
  - Each type has unique visual appearance (block1.svg, block2.svg, ... block8.svg)
  - Inside the level text file (e.g. level.1), it is represented by 1, 2, ... 8
  - Can be moved left/right only
  - Subject to gravity
  - Eliminate when 2+ same types touch
- **Immovable Blocks**: 1 type
  - Has visual appearance of block9.svg
  - Inside the level text file (e.g. level.1), it is represented by 9
  - Cannot be moved or eliminated
  - Serve as obstacles/platforms

#### 1.3 Block Movement Rules

- Blocks can only be moved to **immediately adjacent** left/right empty positions
- Movement beyond one position is invalid and should be rejected
- Blocks fall due to gravity when not supported
- Only one block can be moved at one time

#### 1.4 Block Elimination

- When 2+ blocks of same type are **adjacent** (touching), they eliminate
- Elimination triggers after movement and gravity settle
- Process continues until no more eliminations possible

#### 1.5 Level Progression

- **59 levels** total
- Levels loaded from level files (level.1 through level.59)
- Number 1 to 8 represent movable block with the corresponding visual appearance block1.svg to block2.svg
- Number 9 represents immovable block with visual appearance block9.svg
- Number 0 represents empty position
- Level cleared when all movable blocks eliminated
- Auto-advance to next level on completion
- Show congrats when all 59 levels completed

### 2. User Interface Components

#### 2.1 Game Display Area

- Visual game board showing all blocks
- Smooth animations for movement and elimination
- Visual feedback for valid/invalid moves

#### 2.2 Control Panel

- **Current Level Display**: Shows "Level: XX"
- **Block Counter**: Shows remaining movable blocks
- **Previous Level Button**: Go to previous level (disabled on Level 1)
- **Restart Button**: Restart current level
- **Next Level Button**: Go to next level (disabled on Level 59)
- **Colorful Game Title**: "Vexed" with each letter in different colors

#### 2.3 Responsive Design

- Adapt to different screen sizes
- Generate different resolution of visual pattern of blocks
- Maintain aspect ratio and playability
- Touch-friendly on mobile devices

### 3. Input Handling

#### 3.1 Mouse/Touch Controls

- **Click/Tap and Drag**: Select and move blocks (both mouse and touch)
- **Release**: Attempt to place block at adjacent horizontal position only
- **Visual Feedback**: Dragging state, highlighting during elimination
- **Mobile Optimization**: Touch events with preventDefault and touchAction: 'none'
- **Input Blocking**: Prevents moves during animations

#### 3.2 Animation System

- **Movement Animation**: Smooth horizontal block movement with CSS transitions
- **Gravity Animation**: Step-by-step falling with configurable timing
- **Elimination Animation**: Two-phase system with highlighting and staggered elimination
- **Victory Animations**: Celebration effects with auto-progress timer
- **Animation Blocking**: Proper state management prevents input conflicts
- **Responsive Timing**: Configurable animation timings via constants

## Technical Requirements

### 1. Architecture

#### 1.1 Component Structure

```
App/
├── GameBoard/           # Visual game board component
├── ControlPanel/        # UI controls (Previous/Restart/Next Level)
├── Block/              # Individual block component with drag/touch support
├── VictoryOverlay/     # Level completion overlay with auto-progress
├── FinalVictoryOverlay/ # Game completion celebration
├── LoadingScreen/      # Level loading indicator
└── useGameEngine/      # Custom hook for game logic and state
```

#### 1.2 State Management

- **Game State**: Current board configuration (10x8 array)
- **UI State**: Current level, block count, game status
- **Animation State**: Movement and elimination tracking with proper blocking
- **Victory States**: Level completion and final game completion
- **Constants Management**: Centralized game constants in gameConstants.js
- Uses React hooks and useState/useCallback (no external state library)

#### 1.3 Game Logic Modules

- **Movement Validator**: Validates adjacent horizontal moves only
- **Gravity Engine**: Step-by-step animated falling with physics
- **Elimination Engine**: Highlights and eliminates 2+ connected blocks with staggered animations
- **Level Manager**: Loads all 59 levels from text files with error handling
- **Animation System**: Prevents input during animations to avoid conflicts
- **Mobile Support**: Touch event handlers for mobile drag-and-drop

### 2. Data Structures

#### 2.1 Block Representation

```javascript
{
  type: number,        // 0=empty, 1-8=movable, 9=immovable
  position: {x, y},    // Board coordinates
  id: string,         // Unique identifier
  img: string,        // image file (SVG)
}
```

#### 2.2 Board State

```javascript
{
  blocks: Block[][],   // 10x8 array
  level: number,       // Current level 1-59
  moveableCount: number, // Remaining movable blocks
  status: 'playing' | 'completed' | 'loading'
}
```

### 3. Level Data Format

#### 3.1 Level Files

- **Format**: 8 rows × 10 columns of digits
- **Values**:
  - 0 = empty space
  - 1-8 = movable block types
  - 9 = immovable block
- **Storage**: text files
- **Loading**: Asynchronous level loading

### 4. Performance Requirements

#### 4.1 Responsiveness

- **Animation Frame Rate**: 60 FPS
- **Move Response Time**: < 100ms
- **Level Load Time**: < 500ms
- **Memory Usage**: Efficient block management

#### 4.2 Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Support**: iOS Safari, Android Chrome
- **No IE Support**: Focus on modern web standards

## Non-Functional Requirements

### 1. User Experience

#### 1.1 Accessibility

- **Keyboard Navigation**: Arrow keys for block selection/movement
- **Screen Reader Support**: ARIA labels and descriptions
- **Color Contrast**: WCAG 2.1 AA compliance
- **Focus Management**: Clear visual focus indicators

#### 1.2 Visual Design

- **Modern UI**: Clean, minimalist design using Tailwind CSS
- **Consistent Theming**: Color scheme and typography
- **Visual Hierarchy**: Clear distinction between game elements
- **Responsive Layout**: Mobile-first design approach

#### 1.3 User Feedback

- **Visual Cues**: Highlight valid moves, show errors
- **Sound Effects**: Optional audio feedback (configurable)
- **Progress Indication**: Level completion celebration

### 2. Code Quality

#### 2.1 Development Standards

- **ES6+ JavaScript**: Modern syntax and features
- **Component Architecture**: Reusable, testable components
- **Code Documentation**: JSDoc comments
- **Error Handling**: Graceful error recovery

#### 2.2 Testing Strategy

- **Unit Tests**: Jest for game logic
- **Component Tests**: React Testing Library
- **Integration Tests**: Full game flow testing
- **Test Coverage**: > 80% code coverage

### 3. Development Workflow

#### 3.1 Build Process

- **Development Server**: Hot reload for development
- **Production Build**: Optimized, minified bundle
- **Asset Optimization**: Image compression, code splitting
- **Bundle Analysis**: Size monitoring

#### 3.2 Code Quality Tools

- **Linting**: ESLint with React rules
- **Formatting**: Prettier for consistent code style
- **Type Checking**: PropTypes or TypeScript (optional)
- **Git Hooks**: Pre-commit validation

## Asset Requirements

### 1. Block Graphics

- **8 Movable Block Types**: Unique visual designs for each type (block1.svg to block8.svg)
- **1 Immovable Block**: Distinct appearance from movable blocks (block9.svg)
- **Format**: SVG
- **Size**: 40×40 pixels base size (scalable)

### 2. UI Assets

- **Buttons**: Restart, Next Level controls
- **Icons**: Close button, navigation elements
- **Background**: Optional background patterns/gradients

## Success Criteria

### 1. Gameplay

- All 59 levels playable and completable
- Smooth animations and responsive controls
- Correct implementation of game rules
- No game-breaking bugs
- Mobile touch support for drag-and-drop
- Level navigation with Previous/Next buttons

### 2. Performance

- Fast loading times on modern devices
- Smooth 60 FPS gameplay with CSS transitions
- Responsive across device sizes (mobile-first design)
- Animation blocking prevents performance issues
- Optimized bundle size (~200KB total)

### 3. Code Quality

- Clean, maintainable codebase without over-engineering
- Following React best practices (hooks, functional components)
- Proper error handling and edge cases
- ESLint compliance with zero errors
- Constants management and magic number elimination
- Comprehensive animation state management
