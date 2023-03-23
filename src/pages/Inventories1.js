import DataTable from "react-data-table-component";
import { Resizable } from "re-resizable";

const ResizableCell = ({ value }) => (
  <Resizable
    defaultSize={{
      width: 100,
      height: 20
    }}
  >
    <div>{value}</div>
  </Resizable>
);

const columns = [
  {
    name: "Name",
    selector: "name",
    sortable: true,
    cell: row => <ResizableCell value={row.name} />
  },
  {
    name: "Address",
    selector: "address",
    sortable: true,
    cell: row => <ResizableCell value={row.address} />
  },
  {
    name: "Age",
    selector: "age",
    sortable: true,
    cell: row => <ResizableCell value={row.age} />
  }
];

const data = [
  { id: 1, name: "John Doe", address: "123 Main St.", age: 25 },
  { id: 2, name: "Jane Smith", address: "456 Oak Ave.", age: 32 },
  { id: 3, name: "Bob Johnson", address: "789 Pine Rd.", age: 45 },
];

const ResizableDataTable = () => (
  <DataTable columns={columns} data={data} keyField="id" />
);

export default ResizableDataTable;
