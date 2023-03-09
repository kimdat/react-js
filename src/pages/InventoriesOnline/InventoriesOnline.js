import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCheckbox,
  MDBContainer,
  MDBIcon,
} from "mdb-react-ui-kit";
import React, { useState } from "react";
import InventoriesComponentOnline from "./InventoriesComponentOnline";
import { api } from "../../Interceptor";
const API_URL = api.defaults.baseURL;
const InventoriesOnline = () => {
  const [inputs, setInputs] = useState({});
  const [searchApiData, setSearchApiData] = useState([]);
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post(API_URL + "createOnline", inputs);
      console.log(data);
      //nếu cha insert thành công
      if (data[0].Name !== "") {
        setSearchApiData(data);
      }
      //nếu như searchapidata đang có dữ liệu
      else if (searchApiData.length > 0) setSearchApiData([]);
    } catch (error) {
      console.log("Err");
      console.log(error);
    }
  };
  const handleShow = async (e) => {
    e.preventDefault();

    try {
      const inputs=['1678353059rd6409a2a3a9dd42.86616301','']
      /*const { data } = await api.post(API_URL + "createOnline", inputs);
      console.log(data);
      //nếu cha insert thành công
      if (data[0].Name !== "") {
        setSearchApiData(data);
      }
      //nếu như searchapidata đang có dữ liệu
      else if (searchApiData.length > 0) setSearchApiData([]);*/
    } catch (error) {
      console.log("Err");
      console.log(error);
    }
  };

  return (
    <div>
      <MDBBtn onClick={handleShow} size="lg">
        handleShow
      </MDBBtn>
      <form onSubmit={handleSubmit} id="formLogin">
        <div className="mb-3">
          <label htmlFor="ip">
            Ip <span style={{ color: "red" }}>*</span>
          </label>
          <input
            className="form-control"
            onChange={handleChange}
            name="ip"
            id=""
            placeholder="Ip"
          />
        </div>
      </form>

      <MDBBtn type="submit" form="formLogin" size="lg">
        Create
      </MDBBtn>

      <MDBContainer fluid>
        <MDBCard
          className="bg-white my-5 mx-auto"
          style={{ position: "static" }}
        >
          <MDBCardBody className="p-5 w-100 d-flex flex-column">
            {searchApiData.length > 0 && (
              <InventoriesComponentOnline data={searchApiData} />
            )}
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};
export default InventoriesOnline;
