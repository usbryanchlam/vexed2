import { useState, useEffect } from 'react'
import { BLOCK_TYPES, ADJACENT_DISTANCE } from './constants/gameConstants'
import block1 from './assets/block1.svg'
import block2 from './assets/block2.svg'
import block3 from './assets/block3.svg'
import block4 from './assets/block4.svg'
import block5 from './assets/block5.svg'
import block6 from './assets/block6.svg'
import block7 from './assets/block7.svg'
import block8 from './assets/block8.svg'
import block9 from './assets/block9.svg'

function Block({ type, row, col, onMove, eliminating = false, highlighting = false, eliminationDelay = 0 }) {
  const [isDragging, setIsDragging] = useState(false)

  // Always call hooks, even for empty cells
  useEffect(() => {
    if (!isDragging) return

    const handleMouseUp = (e) => {
      // Find the target cell by looking at the element under the mouse
      const targetElement = document.elementFromPoint(e.clientX, e.clientY)
      const targetCell = targetElement?.closest('.board-cell')
      
      if (targetCell) {
        const targetRow = parseInt(targetCell.dataset.row)
        const targetCol = parseInt(targetCell.dataset.col)
        
        // Only move if it's to an adjacent horizontal position
        if (targetRow === row && Math.abs(targetCol - col) === ADJACENT_DISTANCE) {
          if (onMove) {
            onMove(row, col, targetRow, targetCol)
          }
        } else if (targetRow !== row || targetCol !== col) {
          // Invalid move: can only move to adjacent horizontal positions
        }
      }
      
      setIsDragging(false)
    }

    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, row, col, onMove])

  // Return early after hooks
  if (type === BLOCK_TYPES.EMPTY) return null // Empty cell

  const getBlockImage = (blockType) => {
    const blockAssets = {
      1: block1,
      2: block2,
      3: block3,
      4: block4,
      5: block5,
      6: block6,
      7: block7,
      8: block8,
      9: block9
    }
    return blockAssets[blockType]
  }

  const handleMouseDown = (e) => {
    if (type === BLOCK_TYPES.IMMOVABLE) return // Immovable blocks can't be dragged
    setIsDragging(true)
    e.preventDefault()
  }

  const handleClick = () => {
    if (type !== BLOCK_TYPES.IMMOVABLE) {
      // Block click handler (for debugging)
    }
  }

  return (
    <div 
      className={`block ${isDragging ? 'dragging' : ''} ${eliminating ? 'eliminating' : ''} ${highlighting ? 'highlighting' : ''}`}
      onMouseDown={eliminating || highlighting ? undefined : handleMouseDown} // Prevent interaction during animations
      onClick={eliminating || highlighting ? undefined : handleClick}
      data-type={type}
      data-row={row}
      data-col={col}
      data-elimination-delay={eliminating ? eliminationDelay : undefined}
    >
      <img 
        src={getBlockImage(type)}
        alt={`Block type ${type}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none'
        }}
        draggable={false}
      />
    </div>
  )
}

export default Block