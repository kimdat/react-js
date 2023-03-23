import React, { useEffect, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./LAYOUT/Layout.js";
import DeviceManagementPage from "./features/devices/DeviceManagementPage";
import ResizableDataTable from "./pages/Inventories1";

const Inventories = lazy(() =>
  import("./pages/DEVICEINVENTORY/DeviceInventoryManage")
);
const InventoriesOnline = lazy(() =>
  import("./pages/InventoriesOnline/InventoriesOnline")
);
const Login = lazy(() => import("./pages/Login/Login"));

function App() {
  const isLoggedIn = !!localStorage.getItem("email");
  useEffect(() => {
    if (!isLoggedIn && window.location.pathname !== "/") {
      window.location.href = "/";
    }
  }, [isLoggedIn]);
  return (
    <div style={{ width: "100%" }}>
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
          <Route
            exact
            path="/device-management"
            element={
              <Layout>
                  <DeviceManagementPage />
              </Layout>
            }
          ></Route>
          <Route
            exact
            path="/test"
            element={
              <Layout>
                <div>
                  <ResizableDataTable />
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
