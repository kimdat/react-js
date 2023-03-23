import { Resizable } from "re-resizable";
import React from "react";
import { Form } from "react-bootstrap";

export const FilterColumn = React.memo(
  ({ column, handleFilterColumn, nameTitle, width }) => {
    return (
      <Resizable style={{ width: "100%" }}>
        <Form.Group
          style={{
            marginBottom: "10px",
            paddingRight: "10px",
          }}
          className={`rdt_TableHead${column} rdt_tableHead`}
        >
          <Form.Label> {nameTitle}</Form.Label>
          <Form.Control
            name={column}
            className="filterColumn"
            onKeyDown={handleFilterColumn}
            type="text"
            size="sm"
          ></Form.Control>
        </Form.Group>
      </Resizable>
    );
  }
);

export default FilterColumn;
