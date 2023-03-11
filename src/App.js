import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./LAYOUT/Layout.js";
const Login = React.lazy(() => import("./pages/Login/Login"));
const Inventories = React.lazy(() =>
  import("./pages/DeviceInventoryManage/DeviceInventoryManage")
);
const InventoriesOnline = React.lazy(() =>
  import("./pages/InventoriesOnline/InventoriesOnline")
);

function App() {
  const isLoggedIn = !!localStorage.getItem("email");
  useEffect(() => {
    if (!isLoggedIn && window.location.pathname !== "/") {
      window.location.href = "/";
    }
  }, [isLoggedIn]);
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
          <Route
            exact
            path="/inventories"
            element={
              <Layout>
                <Inventories flagOffline={true} />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/inventoriesOnline"
            element={
              <Layout>
                <div className="inventoriesOnline">
                  <InventoriesOnline />
                </div>
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/managementDeviceInventories"
            element={
              <Layout>
                <div>
                  <Inventories />
                </div>
              </Layout>
            }
          ></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
