import React, { useMemo } from "react";
import DataTable from "react-data-table-component";
import {
  FILED_Expand_Row_Component,
  WIDTH_COLUMN_Expand_Row_Component,
} from "./ConstraintExpandRowComponent";

const ExpandRowComponent = React.memo(({ row }) => {
  const columnsChild = useMemo(
    () => [
      {
        width: WIDTH_COLUMN_Expand_Row_Component.Selected,
      },
      {
        width: WIDTH_COLUMN_Expand_Row_Component.No,
      },
      {
        width: WIDTH_COLUMN_Expand_Row_Component.DeviceName,
      },
      {
        name: "Name",
        selector: (row) => row[FILED_Expand_Row_Component.Name],
      },
      {
        name: "PID",
        selector: (row) => row[FILED_Expand_Row_Component.Pid],
      },
      {
        name: "Serial",
        selector: (row) => row[FILED_Expand_Row_Component.Serial],
      },

      {
        name: "CDESC",
        selector: (row) => row[FILED_Expand_Row_Component.CDESC],
        width: WIDTH_COLUMN_Expand_Row_Component.CDESC,
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
