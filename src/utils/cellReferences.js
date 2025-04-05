export const columnIndexToLabel = (index) => {
  let label = "";
  index += 1;

  while (index > 0) {
    const remainder = (index - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    index = Math.floor((index - 1) / 26);
  }

  return label;
};

export const cellIdToPosition = (cellId) => {
  const colLetters = cellId.match(/^[A-Z]+/)[0];
  const rowNumber = parseInt(cellId.slice(colLetters.length));

  let colIndex = 0;
  for (let i = 0; i < colLetters.length; i++) {
    colIndex = colIndex * 26 + (colLetters.charCodeAt(i) - 64);
  }

  return { row: rowNumber - 1, col: colIndex - 1 };
};

export const positionToCellId = (row, col) => {
  return `${columnIndexToLabel(col)}${row + 1}`;
};
