import { MDBBtn, MDBCard, MDBCardBody, MDBContainer } from "mdb-react-ui-kit";
import React, { createRef } from "react";

import DataExecute from "./DataExecute";

const InventoriesOnline = () => {
  console.log("invonline");
  const childRef = createRef();
  const handleButtonClick = () => {
    // Gọi hàm handleClick() trong component con
    childRef.current.handleClick();
  };

  return (
    <div>
      <MDBBtn
        type="submit"
        form="formLogin"
        size="lg"
        onClick={handleButtonClick}
      >
        Create
      </MDBBtn>

      <MDBContainer fluid>
        <MDBCard
          className="bg-white my-5 mx-auto"
          style={{ position: "static" }}
        >
          <MDBCardBody className="p-5 w-100 d-flex flex-column">
            <DataExecute ref={childRef}></DataExecute>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};
export default InventoriesOnline;
