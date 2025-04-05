import { useRef, useEffect } from "react";
import Cell from "./Cell";
import ColumnHeader from "./ColumnHeader";
import RowHeader from "./RowHeader";
import { useVirtualization } from "../hooks/useVirtualization";
import { positionToCellId, cellIdToPosition } from "../utils/cellReferences";

const CELL_HEIGHT = 32;
const CELL_WIDTH = 96;
const ROW_HEADER_WIDTH = 40;

const SpreadsheetGrid = ({
  rows,
  cols,
  selectedCell,
  editingCell,
  editValue,
  getCellDisplayValue,
  setSelectedCell,
  startEditing,
  stopEditing,
  setEditValue,
}) => {
  const gridRef = useRef(null);

  const { startRow, endRow, startCol, endCol } = useVirtualization(
    rows,
    cols,
    CELL_HEIGHT,
    CELL_WIDTH,
    gridRef
  );

  const totalHeight = rows * CELL_HEIGHT + CELL_HEIGHT;
  const totalWidth = cols * CELL_WIDTH + ROW_HEADER_WIDTH;

  const handleKeyDown = (e) => {
    if (!selectedCell) return;

    if (editingCell) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        stopEditing();
        const { row, col } = cellIdToPosition(selectedCell);
        const nextCellId = positionToCellId(row + 1, col);
        setSelectedCell(nextCellId);
      } else if (e.key === "Tab") {
        e.preventDefault();
        stopEditing();

        const { row, col } = cellIdToPosition(selectedCell);
        const nextCellId = positionToCellId(row, col + (e.shiftKey ? -1 : 1));
        setSelectedCell(nextCellId);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setEditValue("");
        stopEditing();
      }
    } else {
      const { row, col } = cellIdToPosition(selectedCell);

      if (e.key === "Enter") {
        e.preventDefault();
        startEditing(selectedCell);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSelectedCell(null);
      } else if (e.key === "Tab") {
        e.preventDefault();
        const nextCellId = positionToCellId(row, col + (e.shiftKey ? -1 : 1));
        setSelectedCell(nextCellId);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (row > 0) {
          setSelectedCell(positionToCellId(row - 1, col));
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedCell(positionToCellId(row + 1, col));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (col > 0) {
          setSelectedCell(positionToCellId(row, col - 1));
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setSelectedCell(positionToCellId(row, col + 1));
      } else if (/^[a-zA-Z0-9=+\-*/().,%]$/.test(e.key)) {
        startEditing(selectedCell);
        setEditValue(e.key);
      }
    }
  };

  useEffect(() => {
    if (selectedCell && gridRef.current && !editingCell) {
      gridRef.current.focus();
    }
  }, [selectedCell, editingCell]);

  const visibleCells = [];

  for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
    for (let colIndex = startCol; colIndex <= endCol; colIndex++) {
      const cellId = positionToCellId(rowIndex, colIndex);
      const value = getCellDisplayValue(cellId);
      const isSelected = cellId === selectedCell;
      const isEditing = cellId === editingCell;

      visibleCells.push(
        <div
          key={cellId}
          style={{
            position: "absolute",
            top: (rowIndex + 1) * CELL_HEIGHT,
            left: colIndex * CELL_WIDTH + ROW_HEADER_WIDTH,
            width: CELL_WIDTH,
            height: CELL_HEIGHT,
          }}
        >
          <Cell
            cellId={cellId}
            value={value}
            isSelected={isSelected}
            isEditing={isEditing}
            editValue={editValue}
            onSelect={setSelectedCell}
            onDoubleClick={startEditing}
            onChange={setEditValue}
          />
        </div>
      );
    }
  }

  const columnHeaders = [];
  for (let colIndex = startCol; colIndex <= endCol; colIndex++) {
    columnHeaders.push(
      <div
        key={`col-${colIndex}`}
        style={{
          position: "absolute",
          top: 0,
          left: colIndex * CELL_WIDTH + ROW_HEADER_WIDTH,
          width: CELL_WIDTH,
          height: CELL_HEIGHT,
        }}
      >
        <ColumnHeader index={colIndex} />
      </div>
    );
  }

  const rowHeaders = [];
  for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
    rowHeaders.push(
      <div
        key={`row-${rowIndex}`}
        style={{
          position: "absolute",
          top: (rowIndex + 1) * CELL_HEIGHT,
          left: 0,
          width: ROW_HEADER_WIDTH,
          height: CELL_HEIGHT,
        }}
      >
        <RowHeader index={rowIndex} />
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      className="flex-1 overflow-auto relative border border-gray-300"
      onClick={(e) => {
        if (e.target === e.currentTarget && editingCell) {
          stopEditing();
        }
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div
        className="h-8 w-10 bg-gray-200 border-r border-b border-gray-300 sticky top-0 left-0 z-20"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: ROW_HEADER_WIDTH,
          height: CELL_HEIGHT,
          zIndex: 20,
        }}
      />

      {/* Column headers */}
      {columnHeaders}

      {/* Row headers */}
      {rowHeaders}

      {/* Cells */}
      {visibleCells}

      {/* Total scrollable area */}
      <div style={{ height: totalHeight, width: totalWidth }} />
    </div>
  );
};

export default SpreadsheetGrid;
