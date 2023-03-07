import React, { useMemo } from "react";
import DataTable from "react-data-table-component";

const ExpandRowComponent = React.memo(({ row }) => {

  const columnsChild = useMemo(
    () => [
      {
        name: "",
        selector: "",
        width: "130px",
      },
      {
        name: "Name",
        selector: (row) => row["Name"],
        width: "280px",
      },
      {
        name: "VID",
        selector: (row) => row["VID"],
      },
      {
        name: "Serial",
        selector: (row) => row["Serial"],
      },
      {
        name: "PID",
        selector: (row) => row["PID"],
      },
      {
        name: "CDESC",
        selector: (row) => row["CDESC"],
      },
    ],
    []
  );

  return (
    <DataTable
      striped
      className="tableChild"
      noTableHead
      data={row}
      columns={columnsChild}
    ></DataTable>
  );
});

export default ExpandRowComponent;
