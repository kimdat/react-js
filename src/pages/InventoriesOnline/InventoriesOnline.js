import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBRow } from "mdb-react-ui-kit";
import React, { createRef } from "react";

import DataExecute from "./components/DataExecute/DataExecute";

import Swal from "sweetalert2";
import DevicesOnline from "./components/DeviceOnline/DeviceOnline";
import { FILED_DEVICE_ONLINE } from "./ConstraintDivceOnline";
import { FaRunning } from "react-icons/fa";

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
        id: item[FILED_DEVICE_ONLINE.id].trim(),
        device_type_S: item[FILED_DEVICE_ONLINE.Device_type_S]?.trim(),
        Ip: item[FILED_DEVICE_ONLINE.Ip].trim(),
        DeviceName: item[FILED_DEVICE_ONLINE.Name].trim(),
        port: 22,
        username: "epnm",
        password: "epnm@890!",
      };
    });

    // Gọi hàm handleClick() trong component con
    childRef.current.handleClick(rowCheck);
  };

  return (
    <div className="instanteousCheck">
      <MDBRow style={{ marginTop: "10px" }}>
        <MDBCol md="4">
          <MDBCard className="card-name card-body-class">
            <MDBCardBody>
              <div
                style={{
                  width: "100px",
                  marginBottom: "10px",
                  float: "right",
                }}
              >
                <MDBBtn
                  size="sm"
                  onClick={handleButtonClick}
                  style={{ width: "120px" }}
                >
                  <FaRunning style={{ marginRight: "5px" }}> </FaRunning>
                  Execute
                </MDBBtn>
              </div>
              <div className="clearfix"></div>
              <DevicesOnline ref={deviceRef} />
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="8">
          <MDBCard className="card-name card-body-class">
            <MDBCardBody>
              <DataExecute ref={childRef}></DataExecute>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </div>
  );
};
export default InventoriesOnline;
