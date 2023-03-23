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

import DataExecute from "./components/DataExecute/DataExecute";

import Swal from "sweetalert2";
import DevicesOnline from "./components/DeviceOnline/DeviceOnline";
import { FILED_DEVICE_ONLINE } from "./ConstraintDivceOnline";

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
        id: item[FILED_DEVICE_ONLINE.id],
        device_type_S: item[FILED_DEVICE_ONLINE.Device_type_S],
        Ip: item[FILED_DEVICE_ONLINE.Ip],
        DeviceName: item[FILED_DEVICE_ONLINE.Name],
        port: 22,
        username: "epnm",
        password: "epnm@890!",
      };
    });

    // Gọi hàm handleClick() trong component con
    childRef.current.handleClick(rowCheck);
  };

  return (
    <div style={{ marginTop: "50px" }}>
      <MDBContainer fluid>
        <MDBCard style={{ marginBottom: "-30px" }}>
          <MDBCardHeader style={{ textAlign: "center" }}>
            INSTANTANEOUS CHECK
          </MDBCardHeader>
        </MDBCard>
        <MDBRow style={{ marginTop: "50px" }}>
          <MDBCol md="4" style={{ marginRight: "-15px" }}>
            <MDBCard className="bg-white" style={{ position: "static" }}>
              <MDBCardBody>
                <div
                  style={{
                    width: "100px",
                    marginBottom: "10px",
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
            <MDBCard className="bg-white " style={{ position: "static" }}>
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
