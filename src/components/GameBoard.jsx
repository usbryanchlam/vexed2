import Block from "../Block";

function GameBoard({ board, onBlockMove }) {
  return (
    <div className="max-w-fit mx-auto">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => (
            <div
              key={cell.id}
              className="m-[0.75px] board-cell w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center touch-manipulation"
              data-row={rowIndex}
              data-col={colIndex}
            >
              <Block
                type={cell.type}
                row={rowIndex}
                col={colIndex}
                onMove={onBlockMove}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default GameBoard;
