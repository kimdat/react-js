import React, { useState, useCallback } from "react";
import { VariableSizeList } from "react-window";
import { useTable, useFilters } from "react-table";

export function ReactWindow({ columns, data }) {
  const [itemCount, setItemCount] = useState(data.length);
  const [itemSize, setItemSize] = useState(50);

  const getItemSize = useCallback(
    (index) => {
      // Đặt chiều cao của từng phần tử dữ liệu ở đây
      return itemSize;
    },
    [itemSize]
  );

  const filterRow = useCallback(({ index, style }) => {
    const row = data[index];

    return (
      <div style={style}>
        {columns.map((column) => {
          return (
            <div
              key={column.selector}
              style={{
                width: `${column.width}px`,
                display: "inline-block",
              }}
            >
              {row[column.selector]}
            </div>
          );
        })}
      </div>
    );
  }, []);

  const listRef = useCallback((ref) => {
    if (ref !== null) {
      ref.resetAfterIndex(0, true);
    }
  }, []);

  return (
    <VariableSizeList
      height={500}
      itemCount={itemCount}
      itemSize={getItemSize}
      ref={listRef}
      width={"100%"}
    >
      {filterRow}
    </VariableSizeList>
  );
}
