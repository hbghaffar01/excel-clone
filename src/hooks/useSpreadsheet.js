import { useState, useCallback, useEffect } from "react";
import { useFormula } from "./useFormula";

const ROWS = 10000;
const COLS = 10000;

export const useSpreadsheet = () => {
  const [cells, setCells] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [dependencyGraph, setDependencyGraph] = useState({});
  const evaluateFormula = useFormula(cells, dependencyGraph);

  const getCellValue = useCallback(
    (cellId) => {
      return cells[cellId]?.value || "";
    },
    [cells]
  );

  const getCellDisplayValue = useCallback(
    (cellId) => {
      const cell = cells[cellId];
      if (!cell) return "";

      if (cell.formula) {
        try {
          const result = evaluateFormula(cell.formula, cellId);
          return result;
        } catch (error) {
          return `#ERROR: ${error.message}`;
        }
      }

      return cell.value || "";
    },
    [cells, evaluateFormula]
  );

  const extractCellReferences = useCallback((formula) => {
    if (!formula || typeof formula !== "string" || !formula.startsWith("=")) {
      return [];
    }

    const cellRefs = [];
    const regex = /[A-Z]+\d+/g;
    let match;

    while ((match = regex.exec(formula)) !== null) {
      cellRefs.push(match[0]);
    }

    return cellRefs;
  }, []);

  const updateDependencyGraph = useCallback(
    (cellId, formula) => {
      setDependencyGraph((prev) => {
        const newGraph = { ...prev };

        Object.keys(newGraph).forEach((dep) => {
          if (newGraph[dep] && newGraph[dep].includes(cellId)) {
            newGraph[dep] = newGraph[dep].filter((id) => id !== cellId);
          }
        });

        const refs = extractCellReferences(formula);
        refs.forEach((ref) => {
          if (!newGraph[ref]) {
            newGraph[ref] = [];
          }
          if (!newGraph[ref].includes(cellId)) {
            newGraph[ref].push(cellId);
          }
        });

        return newGraph;
      });
    },
    [extractCellReferences]
  );

  const updateDependentCells = useCallback(
    (cellId) => {
      const dependent = dependencyGraph[cellId];
      if (!dependent || dependent.length === 0) return;

      const queue = [...dependent];
      const processed = new Set();

      setCells((prev) => {
        const newCells = { ...prev };

        while (queue.length > 0) {
          const currentId = queue.shift();
          if (processed.has(currentId)) continue;
          processed.add(currentId);

          const cell = newCells[currentId];
          if (cell && cell.formula) {
            try {
              const newValue = evaluateFormula(cell.formula, currentId);
              newCells[currentId] = { ...cell, value: newValue };
              const dependents = dependencyGraph[currentId] || [];
              queue.push(...dependents);
            } catch (error) {
              newCells[currentId] = {
                ...cell,
                value: `#ERROR: ${error.message}`,
              };
            }
          }
        }

        return newCells;
      });
    },
    [dependencyGraph, evaluateFormula]
  );

  const updateCell = useCallback(
    (cellId, newValue) => {
      const oldFormula = cells[cellId]?.formula;

      setCells((prev) => {
        const updatedCells = { ...prev };
        const isFormula =
          typeof newValue === "string" && newValue.startsWith("=");

        if (isFormula) {
          try {
            const evalResult = evaluateFormula(newValue, cellId);
            updatedCells[cellId] = {
              value: evalResult,
              formula: newValue,
            };
          } catch (error) {
            updatedCells[cellId] = {
              value: `#ERROR: ${error.message}`,
              formula: newValue,
            };
          }
        } else {
          updatedCells[cellId] = {
            value: newValue,
            formula: null,
          };
        }

        return updatedCells;
      });

      const newFormula =
        typeof newValue === "string" && newValue.startsWith("=")
          ? newValue
          : null;
      if (oldFormula !== newFormula) {
        updateDependencyGraph(cellId, newFormula);
      }
      setTimeout(() => updateDependentCells(cellId), 0);
    },
    [cells, evaluateFormula, updateDependencyGraph, updateDependentCells]
  );

  const startEditing = useCallback(
    (cellId) => {
      const cell = cells[cellId];
      setEditingCell(cellId);
      setEditValue(cell?.formula || cell?.value || "");
    },
    [cells]
  );

  const stopEditing = useCallback(() => {
    if (editingCell) {
      updateCell(editingCell, editValue);
      setEditingCell(null);
      setEditValue("");
    }
  }, [editingCell, editValue, updateCell]);

  useEffect(() => {
    if (Object.keys(cells).length === 0) {
      updateCell("A1", "5");
      updateCell("B1", "10");
      updateCell("C1", "=A1+B1");
    }
  }, []);

  return {
    cells,
    selectedCell,
    editingCell,
    editValue,
    getCellValue,
    getCellDisplayValue,
    updateCell,
    setSelectedCell,
    startEditing,
    stopEditing,
    setEditValue,
    ROWS,
    COLS,
  };
};

export default useSpreadsheet;
