import { useState, useCallback, useEffect } from "react";

export const useVirtualization = (
  totalRows,
  totalCols,
  rowHeight,
  colWidth,
  scrollContainerRef
) => {
  const [visibleRange, setVisibleRange] = useState({
    startRow: 0,
    endRow: 50,
    startCol: 0,
    endCol: 20,
  });

  const updateVisibleRange = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollLeft, clientHeight, clientWidth } =
      scrollContainerRef.current;

    const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - 5);
    const endRow = Math.min(
      totalRows - 1,
      Math.ceil((scrollTop + clientHeight) / rowHeight) + 5
    );

    const startCol = Math.max(0, Math.floor(scrollLeft / colWidth) - 5);
    const endCol = Math.min(
      totalCols - 1,
      Math.ceil((scrollLeft + clientWidth) / colWidth) + 5
    );

    setVisibleRange({ startRow, endRow, startCol, endCol });
  }, [totalRows, totalCols, rowHeight, colWidth, scrollContainerRef]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    scrollContainer.addEventListener("scroll", updateVisibleRange);
    window.addEventListener("resize", updateVisibleRange);

    updateVisibleRange();
    return () => {
      scrollContainer.removeEventListener("scroll", updateVisibleRange);
      window.removeEventListener("resize", updateVisibleRange);
    };
  }, [updateVisibleRange, scrollContainerRef]);

  return visibleRange;
};
