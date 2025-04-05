import { useEffect } from "react";
import Toolbar from "./components/Toolbar";
import FormulaBar from "./components/FormulaBar";
import SpreadsheetGrid from "./components/SpreadsheetGrid";
import { useSpreadsheet } from "./hooks/useSpreadsheet";

function App() {
  const {
    cells,
    selectedCell,
    editingCell,
    editValue,
    getCellDisplayValue,
    updateCell,
    setSelectedCell,
    startEditing,
    stopEditing,
    setEditValue,
    ROWS,
    COLS,
  } = useSpreadsheet();

  useEffect(() => {
    if (Object.keys(cells).length === 0) {
      updateCell("A1", "2");
      updateCell("B1", "3");
      updateCell("C1", "=A1+B1");
    }
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Toolbar />
      <FormulaBar
        selectedCell={selectedCell}
        value={
          selectedCell
            ? cells[selectedCell]?.formula || cells[selectedCell]?.value || ""
            : ""
        }
        onChange={(value) => {
          if (selectedCell) {
            setEditValue(value);
            if (!editingCell) {
              updateCell(selectedCell, value);
            }
          }
        }}
      />
      <SpreadsheetGrid
        rows={ROWS}
        cols={COLS}
        selectedCell={selectedCell}
        editingCell={editingCell}
        editValue={editValue}
        getCellDisplayValue={getCellDisplayValue}
        setSelectedCell={setSelectedCell}
        startEditing={startEditing}
        stopEditing={stopEditing}
        setEditValue={setEditValue}
      />

      <div className="bg-gray-100 p-2 border-t border-gray-300 text-xs max-h-32 overflow-auto">
        <div>Selected: {selectedCell || "none"}</div>
        <div>Editing: {editingCell || "none"}</div>
        <div>Edit Value: {editValue}</div>
        <div>
          Cells: {Object.keys(cells).length} cells defined.
          {selectedCell && (
            <div>Current: {JSON.stringify(cells[selectedCell])}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
