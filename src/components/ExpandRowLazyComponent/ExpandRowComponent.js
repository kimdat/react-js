import React, { useMemo } from "react";
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  FILED_Expand_Row_Component,
  WIDTH_COLUMN_Expand_Row_Component,
} from "./ConstraintExpandRowComponent";
const paddingWhenScroll = () => {
  const expandRow = document
    .querySelector(".expandRowClass")
    .querySelectorAll(".rdt_TableBody")[0];
  console.log(expandRow.offsetHeight);
  console.log(expandRow.style.height);
};
const ExpandRowComponent = React.memo(({ row }) => {
  useEffect(() => {
    paddingWhenScroll();
  }, []);
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
        dense={true}
        highlightOnHover
        data={row}
        responsive={true}
        columns={columnsChild}
        className="expandRowClass"
      ></DataTable>
    </div>
  );
});

export default ExpandRowComponent;
