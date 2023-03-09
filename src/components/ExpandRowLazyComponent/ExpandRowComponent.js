import React, { useMemo } from "react";
import DataTable from "react-data-table-component";

const ExpandRowComponent = React.memo(({ row }) => {
  const columnsChild = useMemo(
    () => [
      {
        name: "",
        selector: "",
        width: "9.5%",
      },
      {
        name: "Name",
        selector: (row) => row["Name"],
        width: "20%",
      },
      {
        name: "VID",
        selector: (row) => row["VID"],
        width: "15%",
      },
      {
        name: "Serial",
        selector: (row) => row["Serial"],
        width: "14.5%",
      },
      {
        name: "PID",
        selector: (row) => row["PID"],
        width: "15%",
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
