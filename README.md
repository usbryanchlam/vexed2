# Vexed Puzzle Game 🧩

A modern web-based implementation of the classic Vexed block puzzle game built with React.js and Tailwind CSS. Challenge yourself with 59 levels of strategic block elimination!

## 🎮 Game Overview

Vexed is a strategic block elimination puzzle where:

- Move blocks horizontally to make matching blocks touch
- When 2+ blocks of the same type are adjacent, they eliminate
- Gravity applies - blocks fall when not supported
- Clear all movable blocks to complete each level
- Navigate through 59 increasingly challenging levels

## ✨ Features

### 🎯 Core Gameplay

- **59 Unique Levels** - Complete puzzle progression
- **Strategic Movement** - Only adjacent horizontal moves allowed
- **Block Elimination** - 2+ matching adjacent blocks disappear
- **Physics System** - Realistic gravity with smooth animations
- **Victory Celebrations** - Level completion with auto-advance

### 🎨 User Interface

- **Colorful Title** - Rainbow "Vexed" logo for visual appeal
- **Complete Navigation** - Previous/Restart/Next level controls
- **Responsive Design** - Works perfectly on desktop and mobile
- **Smooth Animations** - 60 FPS gameplay with CSS transitions
- **Loading Screens** - Seamless level transitions

### 📱 Mobile Support

- **Touch Controls** - Full drag-and-drop functionality on mobile
- **Responsive Layout** - Adapts to all screen sizes
- **Touch Optimization** - Prevents scrolling during gameplay
- **Cross-Platform** - Consistent experience across devices

### 🎭 Visual Effects

- **Elimination Animations** - Highlighting and staggered block removal
- **Gravity Physics** - Step-by-step falling animations
- **Victory Overlays** - Celebration screens with confetti
- **Input Blocking** - Prevents conflicts during animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd vexed2

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## 🏗️ Technical Stack

- **Frontend**: React.js 19.1.1 with functional components and hooks
- **Styling**: Tailwind CSS 4.1.12 for responsive design
- **Build Tool**: Vite 7.1.2 for fast development and optimized builds
- **Code Quality**: ESLint 9.33.0 with React best practices
- **Package Manager**: npm with lockfile for consistent dependencies

## 📁 Project Structure

```
src/
├── components/
│   ├── ControlPanel.jsx      # Game controls (Previous/Restart/Next)
│   ├── GameBoard.jsx         # Main game board display
│   ├── VictoryOverlay.jsx    # Level completion screen
│   ├── FinalVictoryOverlay.jsx # Game completion celebration
│   └── LoadingScreen.jsx     # Level loading indicator
├── hooks/
│   └── useGameEngine.js      # Core game logic and state management
├── constants/
│   └── gameConstants.js      # Centralized game configuration
├── assets/
│   └── block1-9.svg          # Block graphics (9 types)
├── Block.jsx                 # Individual block component
├── App.jsx                   # Main application component
└── App.css                   # Game-specific styles
```

## 🎮 How to Play

1. **Objective**: Clear all colored (movable) blocks from each level
2. **Movement**: Drag blocks horizontally to adjacent empty positions only
3. **Elimination**: When 2+ blocks of the same color touch, they disappear
4. **Gravity**: Blocks fall when not supported by other blocks
5. **Strategy**: Plan moves carefully - some levels require specific sequences
6. **Progression**: Complete all 59 levels to become a Vexed master!

### Block Types

- **Colored Blocks** (Types 1-8): Movable blocks that can be eliminated
- **Blue Blocks** (Type 9): Immovable obstacle blocks that cannot be moved

### Controls

- **Desktop**: Click and drag blocks with mouse
- **Mobile**: Touch and drag blocks with finger
- **Navigation**: Use Previous/Restart/Next buttons to control levels

## 🔧 Game Mechanics

### Movement Rules

- Blocks can only move to **immediately adjacent** horizontal positions
- Moving beyond one position is invalid and rejected
- Only one block can be moved at a time
- Movement is blocked during animations to prevent conflicts

### Elimination System

- **Detection**: Adjacent blocks of the same type are automatically detected
- **Animation**: Two-phase system with highlighting then staggered elimination
- **Chain Reactions**: Eliminations can trigger gravity and more eliminations
- **Completion**: Level completes when all movable blocks are eliminated

### Physics Engine

- **Gravity**: Blocks fall step-by-step with smooth animations
- **Collision**: Blocks stack on top of each other and immovable obstacles
- **Stability**: Physics settle before allowing new moves

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Create production build
npm run preview  # Preview production build locally
npm run lint     # Run ESLint code quality checks
```

### Code Quality

- **ESLint**: Enforces React best practices and code consistency
- **No Console Messages**: Clean production build without debug output
- **Constants Management**: Centralized configuration prevents magic numbers
- **Error Handling**: Graceful recovery from loading and animation errors

### Architecture

- **Custom Hooks**: `useGameEngine` encapsulates all game logic
- **Component Separation**: Clean separation of UI and game logic
- **State Management**: React hooks without external state libraries
- **Animation System**: CSS transitions with JavaScript coordination

## 🚀 Deployment

### Netlify (Recommended)

The project is configured for easy Netlify deployment:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configuration is handled by `netlify.toml`

### Manual Deployment

1. Run `npm run build`
2. Deploy contents of `dist` folder to any static hosting service
3. Ensure server redirects all routes to `index.html` for SPA support

## 🎯 Performance

- **Bundle Size**: ~200KB total (optimized and gzipped)
- **Loading Time**: <500ms on modern devices
- **Frame Rate**: Smooth 60 FPS animations
- **Mobile Performance**: Optimized for touch devices
- **Memory Usage**: Efficient block management and cleanup

## 📄 License

This project is created for educational and entertainment purposes.

## 🎉 Acknowledgments

- Original Vexed puzzle game concept
- React.js and Vite communities
- Tailwind CSS for rapid styling
- All contributors and players who provided feedback
