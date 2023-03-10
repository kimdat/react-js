import React, { useMemo } from "react";
import DataTable from "react-data-table-component";

const ExpandRowComponent = React.memo(({ row }) => {
  const columnsChild = useMemo(
    () => [
      {
        name: "",
        selector: "",
      },

      {
        name: "Name",
        selector: (row) => row["Name"],
        width: "18%",
      },
      {
        name: "PID",
        selector: (row) => row["PID"],
        width: "14%",
      },
      {
        name: "Serial",
        selector: (row) => row["Serial"],
        width: "14%",
      },

      {
        name: "CDESC",
        selector: (row) => row["CDESC"],
        width: "34.4%",
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
