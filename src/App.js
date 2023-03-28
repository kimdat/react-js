import React, { useEffect, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

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
  const [pageTitle, setPageTitle] = React.useState("");
  const header = {
    logo: {
      url: "https://ctin.vn",
      title: "CTIN",
      logoUrl: "/ctin-logo-1.png",
    },
    navigations: [
      {
        text: "Manage Device",
        url: "/device-management",
      },
      {
        text: "Manage Inventories Online",
        url: "/managementDeviceInventories",
      },
      {
        text: "Manage Inventories Offline",
        url: "/Inventories",
      },
      {
        text: "Instantaneous check",
        url: "/InventoriesOnline",
      },
    ],
    profile: {
      profileGreeting: (username) => `Hello ${username}`,
      signOut: "Logout",
      manageProfile: "Manage account",
    },
  };

  const isLoggedIn = !!localStorage.getItem("email");
  useEffect(() => {
    if (!isLoggedIn && window.location.pathname !== "/") {
      window.location.href = "/";
    }
  }, [isLoggedIn]);

  const location = useLocation();
  useEffect(() => {
    const title = header.navigations?.find((item) => {
      return location.pathname === item.url;
    });
    setPageTitle(title.text);
  }, []);

  return (
    <Layout header={header} title={pageTitle}>
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
          <Route
            exact
            path="/inventories"
            element={<Inventories flagOffline={true} />}
          ></Route>
          <Route
            exact
            path="/inventoriesOnline"
            element={<InventoriesOnline />}
          ></Route>
          <Route
            exact
            path="/managementDeviceInventories"
            element={<Inventories />}
          ></Route>
          <Route
            exact
            path="/device-management"
            element={<DeviceManagementPage />}
          ></Route>
          <Route
            exact
            path="/test"
            element={<ResizableDataTable />}
          ></Route>
        </Routes>
    </Layout>
  );
}

export default App;
