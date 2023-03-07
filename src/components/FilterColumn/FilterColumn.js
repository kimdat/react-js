import React from "react";

export const FilterColumn = React.memo(({ column, handleFilterColumn }) => {
  return (
    <span className={`rdt_TableHead${column} rdt_tableHead`}>
      {column}
      <br />
      <input
        name={column}
        className="filterColumn"
        onKeyDown={handleFilterColumn}
      />
    </span>
  );
});

export default FilterColumn;
