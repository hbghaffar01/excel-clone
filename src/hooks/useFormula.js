import { useMemo } from "react";
import * as math from "mathjs";

export const useFormula = (cells, dependencyGraph) => {
  const evaluateFormula = useMemo(() => {
    return (formula, cellId, visitedCells = new Set()) => {
      if (!formula || typeof formula !== "string" || !formula.startsWith("=")) {
        return formula;
      }

      visitedCells.add(cellId);

      try {
        const expression = formula.slice(1);
        const getCellValue = (refCellId) => {
          if (visitedCells.has(refCellId)) {
            throw new Error("Circular reference detected");
          }

          const cell = cells[refCellId];

          if (!cell) return 0;
          if (cell.formula) {
            const newVisited = new Set([...visitedCells]);
            const result = evaluateFormula(cell.formula, refCellId, newVisited);
            return result;
          }

          const value = cell.value;
          return isNaN(Number(value)) ? value : Number(value);
        };

        const processedExpression = expression.replace(
          /[A-Z]+\d+/g,
          (refCellId) => {
            const value = getCellValue(refCellId);

            if (dependencyGraph && !visitedCells.has(refCellId)) {
              if (!dependencyGraph[refCellId]) {
                dependencyGraph[refCellId] = [];
              }

              if (!dependencyGraph[refCellId].includes(cellId)) {
                dependencyGraph[refCellId].push(cellId);
              }
            }

            return isNaN(Number(value)) ? `"${value}"` : value;
          }
        );

        const result = math.evaluate(processedExpression);
        return result;
      } catch (error) {
        console.log(error, "--error");
        throw error;
      } finally {
        visitedCells.delete(cellId);
      }
    };
  }, [cells, dependencyGraph]);

  return evaluateFormula;
};
