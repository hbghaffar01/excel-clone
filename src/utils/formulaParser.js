import * as math from "mathjs";

export const parseFormula = (formula, getCellValue) => {
  if (!formula || typeof formula !== "string" || !formula.startsWith("=")) {
    return formula;
  }

  try {
    const expression = formula.slice(1);

    const processedExpression = expression.replace(/[A-Z]+\d+/g, (cellId) => {
      const value = getCellValue(cellId);
      return isNaN(Number(value)) ? `"${value}"` : value || 0;
    });

    return math.evaluate(processedExpression);
  } catch (error) {
    return `#ERROR: ${error.message}`;
  }
};
