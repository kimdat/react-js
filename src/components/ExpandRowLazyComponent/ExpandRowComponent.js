import React, { useMemo } from "react";
import DataTable from "react-data-table-component";

const ExpandRowComponent = React.memo(({ row }) => {
  const columnsChild = useMemo(
    () => [
      {
        name: "",
        width: "100px",
      },
      {
        name: "Name",
      },
      {
        name: "Name",
        selector: (row) => row["Name"],
      },
      {
        name: "PID",
        selector: (row) => row["PID"],
      },
      {
        name: "Serial",
        selector: (row) => row["Serial"],
      },

      {
        name: "CDESC",
        selector: (row) => row["CDESC"],
        width: "44.4%",
      },
    ],
    []
  );

  return (
    <div style={{ maxHeight: "300px" }}>
      <DataTable
        striped
        className="tableChild"
        noTableHead
        dense={true}
        highlightOnHover
        data={row}
        responsive={true}
        columns={columnsChild}
      ></DataTable>
    </div>
  );
});

export default ExpandRowComponent;
