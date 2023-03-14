import React, { useState, useCallback } from "react";
import { VariableSizeList } from "react-window";
import DataTable from "react-data-table-component";

const columns = [
  { name: "ID", selector: "id", sortable: true },
  { name: "Name", selector: "name", sortable: true },
  { name: "Age", selector: "age", sortable: true },
];

const data = [
  { id: 1, name: "John Doe", age: 25 },
  { id: 2, name: "Jane Doe", age: 30 },
  { id: 3, name: "Bob Smith", age: 40 },
  // ...
];

function Table() {
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

function App() {
  return (
    <DataTable
      title="React Data Table with React Window"
      columns={columns}
      data={data}
      pagination
      paginationPerPage={10}
      paginationRowsPerPageOptions={[10, 20, 30]}
      noDataComponent="No data found"
      subHeader
      subHeaderComponent={<Table />}
    />
  );
}

export default App;
