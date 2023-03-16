import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCol,
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";
import React, { createRef } from "react";
import DataCreateUpdate from "./DataCreateUpdate";

import DataExecute from "./DataExecute";

import DevicesOnline from "./DeviceOnline";
import Swal from "sweetalert2";

const InventoriesOnline = () => {
  const childRef = createRef();
  const deviceRef = createRef();
  const handleButtonClick = () => {
    const checkedRow = deviceRef.current.checkedRows;
    if (
      checkedRow.length === 0 ||
      checkedRow[0].hasOwnProperty("statusNotFound")
    ) {
      Swal.fire({
        icon: "error",
        text: "Please choose one device",
      });
      return;
    }
    console.log(checkedRow);

    const rowCheck = checkedRow.map((item) => {
      return {
        id: item.id,
        device_type_S: item.Device_type_S,
        ip: item.Ip,
        deviceName: item.Name,
        port: 22,
        username: "epnm",
        password: "epnm@890!",
      };
    });

    // Gọi hàm handleClick() trong component con
    childRef.current.handleClick(rowCheck);
  };

  return (
    <div>
      <DataCreateUpdate />
      <DataCreateUpdate flagUpdate={true} />
      <MDBContainer fluid>
        <MDBCard style={{ marginBottom: "-30px" }}>
          <MDBCardHeader style={{ textAlign: "center" }}>
            INSTANTANEOUS CHECK
          </MDBCardHeader>
        </MDBCard>
        <MDBRow>
          <MDBCol md="4" style={{ marginRight: "-15px" }}>
            <MDBCard
              className="bg-white my-5 mx-auto"
              style={{ position: "static" }}
            >
              <MDBCardBody>
                <div
                  style={{
                    width: "100px",
                    marginBottom: "20px",
                    float: "right",
                  }}
                >
                  <MDBBtn size="sm" onClick={handleButtonClick}>
                    Execute
                  </MDBBtn>
                </div>
                <div className="clearfix"></div>
                <DevicesOnline ref={deviceRef} />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md="8">
            <MDBCard
              className="bg-white my-5 mx-auto"
              style={{ position: "static" }}
            >
              <MDBCardBody>
                <DataExecute ref={childRef}></DataExecute>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};
export default InventoriesOnline;
