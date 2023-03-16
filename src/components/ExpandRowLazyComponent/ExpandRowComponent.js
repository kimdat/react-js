import React, { useMemo } from "react";
import DataTable from "react-data-table-component";

import "./ExpandRowComponent.css";
const ExpandRowComponent = React.memo(({ row }) => {
  const columnsChild = useMemo(
    () => [
      {
        width: "105px",
      },
      {},
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
        width: "44%",
      },
    ],
    []
  );

  return (
    <div>
      <DataTable
        striped
        noTableHead
        fixedHeader={true}
        fixedHeaderScrollHeight="300px"
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
