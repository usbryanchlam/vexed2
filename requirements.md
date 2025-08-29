# Vexed Puzzle Game - Requirements Specification

## Project Overview

This document outlines the requirements for developing a modern web-based version of the classic Vexed puzzle game using React.js and Tailwind CSS. The game is a block-based puzzle where players move blocks to eliminate them by making matching blocks touch each other.

## Technical Stack

- **Frontend Framework**: React.js (JavaScript)
- **Styling**: Tailwind CSS
- **Build Tool**: Modern bundler (Vite/Webpack)
- **Package Manager**: npm/yarn

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
- **Restart Button**: Restart current level
- **Next Level Button**: Go to next level
- **Close Button**: Exit game

#### 2.3 Responsive Design
- Adapt to different screen sizes
- Generate different resolution of visual pattern of blocks
- Maintain aspect ratio and playability
- Touch-friendly on mobile devices

### 3. Input Handling

#### 3.1 Mouse/Touch Controls
- **Click/Tap and Drag**: Select and move blocks
- **Release**: Attempt to place block at target position
- **Visual Feedback**: Show drag state and valid drop zones

#### 3.2 Animation System
- **Movement Animation**: Smooth block movement
- **Gravity Animation**: Falling blocks
- **Elimination Animation**: Block disappearing effect
- **Wait for Completion**: Block further input until animations complete

## Technical Requirements

### 1. Architecture

#### 1.1 Component Structure
```
App/
├── GameBoard/           # Main game container
├── GameDisplay/         # Visual game board
├── ControlPanel/        # UI controls
├── Block/              # Individual block component
└── LevelLoader/        # Level file management
```

#### 1.2 State Management
- **Game State**: Current board configuration
- **UI State**: Current level, block count, game status
- **Animation State**: Movement and elimination tracking
- Use React Context or state management library

#### 1.3 Game Logic Modules
- **Movement Validator**: Check move validity
- **Gravity Engine**: Handle block falling
- **Elimination Engine**: Detect and remove matching blocks
- **Level Manager**: Load and validate levels

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

## Deployment Requirements

### 1. Hosting
- **Static Hosting**: Netlify, Vercel, or GitHub Pages
- **HTTPS**: Secure connection required

### 2. Environment Setup
- **Node.js**: Version 16+ for development
- **Package Lock**: Consistent dependency versions
- **Environment Variables**: Configuration management

## Success Criteria

### 1. Gameplay
- All 59 levels playable and completable
- Smooth animations and responsive controls
- Correct implementation of game rules
- No game-breaking bugs

### 2. Performance
- Fast loading times on modern devices
- Smooth 60 FPS gameplay
- Responsive across device sizes
- Accessible to users with disabilities

### 3. Code Quality
- Clean, maintainable codebase, don't over engineering
- Comprehensive test coverage
- Following React best practices
- Proper error handling and edge cases
