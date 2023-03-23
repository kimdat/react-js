import React from "react";
import { Form } from "react-bootstrap";

export const FilterColumn = React.memo(
  ({ column, handleFilterColumn, nameTitle, width }) => {
    return (
      <Form.Group
        style={{
          marginBottom: "10px",
          paddingRight: "10px",
          maxWidth: "100%",
          minWidth: "100%",
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
    );
  }
);

export default FilterColumn;
