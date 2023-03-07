import React, { useState } from "react";

import { api } from "../Interceptor";

import DataTable from "react-data-table-component";

const API_URL = api.defaults.baseURL;
const ExpandableComponent1 = React.memo(
  ({ data }) => {
    console.log("123");
    return (
      <div>
        <p>ID: {data.id}</p>
        <p>Name: {data.name}</p>
        <p>Age: {data.age}</p>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.data === nextProps.data
);

const Inventories1 = () => {
  const data = [
    { id: 1, name: "Alice", age: 25 },
    { id: 2, name: "Bob", age: 30 },
    { id: 3, name: "Charlie", age: 35 },
  ];

  return (
    <DataTable
      title="My Table"
      columns={[
        { name: "ID", selector: (row) => row.id },
        { name: "Name", selector: (row) => row.name },
        { name: "Age", selector: (row) => row.age },
      ]}
      data={data}
      expandableRows
      expandableRowsComponent={({ data }) => (
        <ExpandableComponent1 data={data} />
      )}
      expandableRowExpanded={(row) => {
        return true;
      }}
    />
  );
};
export default Inventories1;
