import { memo } from "react";

const Cell = memo(
  ({
    cellId,
    value,
    isSelected,
    isEditing,
    editValue,
    onSelect,
    onDoubleClick,
    onChange,
  }) => {
    const handleClick = (e) => {
      e.stopPropagation();
      onSelect(cellId);
    };

    const handleDoubleClick = (e) => {
      e.stopPropagation();
      onDoubleClick(cellId);
    };

    const handleInputChange = (e) => {
      e.stopPropagation();
      onChange(e.target.value);
    };

    const handleInputClick = (e) => {
      e.stopPropagation();
    };

    return (
      <div
        className={`
        border-r border-b border-gray-300 h-8 w-24 px-1 
        flex items-center overflow-hidden whitespace-nowrap
        ${
          isSelected
            ? "bg-teal-50 ring-2 ring-teal-400 ring-inset"
            : "bg-white"
        }
      `}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <input
            className="w-full h-full outline-none cell-edit-input"
            value={editValue}
            onChange={handleInputChange}
            onClick={handleInputClick}
            autoFocus
            onKeyDown={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="truncate">{value}</span>
        )}
      </div>
    );
  }
);

export default Cell;
