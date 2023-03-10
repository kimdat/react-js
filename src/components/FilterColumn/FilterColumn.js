import React from "react";

export const FilterColumn = React.memo(
  ({ column, handleFilterColumn, nameTitle }) => {
    return (
      <span className={`rdt_TableHead${column} rdt_tableHead`}>
        {nameTitle}
        <br />
        <input
          style={{ maxWidth: "130px", marginBottom: "10px" }}
          name={column}
          className="filterColumn"
          onKeyDown={handleFilterColumn}
        />
      </span>
    );
  }
);

export default FilterColumn;
