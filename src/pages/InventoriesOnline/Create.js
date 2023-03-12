import { MDBBtn, MDBCard, MDBCardBody, MDBContainer } from "mdb-react-ui-kit";
import React, { useState, useEffect } from "react";
import InventoriesComponentOnline from "./InventoriesComponentOnline";
import { api } from "../../Interceptor";
import Swale from "sweetalert2";
const API_URL = api.defaults.baseURL;

const Create = ({ shouldFetchData, setShouldFetchData }) => {
  console.log("create");
  const handleShowData = async () => {
    setShouldFetchData(!shouldFetchData); // set shouldFetchData to true when the button is clicked
  };

  return (
    <div>
      <MDBBtn type="submit" form="formLogin" size="lg" onClick={handleShowData}>
        Create
      </MDBBtn>
    </div>
  );
};

export default Create;
