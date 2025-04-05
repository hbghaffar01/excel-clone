  
import { memo } from 'react';
import { columnIndexToLabel } from '../utils/cellReferences';

const ColumnHeader = memo(({ index }) => {
  const label = columnIndexToLabel(index);
  
  return (
    <div className="flex items-center justify-center h-8 w-24 bg-gray-100 border-r border-b border-gray-300 font-semibold truncate sticky top-0">
      {label}
    </div>
  );
});

export default ColumnHeader;
