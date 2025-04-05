import { memo } from "react";

const RowHeader = memo(({ index }) => {
  return (
    <div className="flex items-center justify-center h-8 w-10 bg-gray-100 border-r border-b border-gray-300 font-semibold sticky left-0 z-10">
      {index + 1}
    </div>
  );
});

export default RowHeader;
