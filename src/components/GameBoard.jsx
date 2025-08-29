import Block from "../Block";

function GameBoard({ board, onBlockMove }) {
  // Flatten the 2D board array and add position data
  const flattenedBoard = board.flatMap((row, rowIndex) =>
    row.map((cell, colIndex) => ({
      ...cell,
      row: rowIndex,
      col: colIndex,
    }))
  );

  return (
    <div className="game-grid max-w-fit mx-auto">
      {flattenedBoard.map((cell) => (
        <div
          key={cell.id}
          className="board-cell touch-manipulation"
          style={{
            gridArea: `${cell.row + 1} / ${cell.col + 1}`,
          }}
          data-row={cell.row}
          data-col={cell.col}
        >
          <Block
            type={cell.type}
            row={cell.row}
            col={cell.col}
            onMove={onBlockMove}
          />
        </div>
      ))}
    </div>
  );
}

export default GameBoard;
