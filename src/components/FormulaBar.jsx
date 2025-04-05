const FormulaBar = ({ selectedCell, value, onChange }) => {
  return (
    <div className="flex items-center h-10 px-2 border-b border-gray-300 bg-gray-50">
      <div className="font-semibold mr-2 w-16">{selectedCell || ""}</div>
      <input
        className="flex-1 px-2 py-1 border border-gray-300 rounded"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter value or formula starting with ="
      />
    </div>
  );
};

export default FormulaBar;
