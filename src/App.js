import React, { useEffect, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Layout from "./LAYOUT/Layout.js";
import DeviceManagementPage from "./features/devices/DeviceManagementPage";

const Inventories = lazy(() =>
  import("./pages/DEVICEINVENTORY/DeviceInventoryManage")
);
const InventoriesOnline = lazy(() =>
  import("./pages/InventoriesOnline/InventoriesOnline")
);
const Login = lazy(() => import("./pages/Login/Login"));

function App() {
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
        hasSubMenu: false,
      },
      {
        text: "Manage Inventories",
        navigations: [
          {
            text: "Online",
            url: "/managementDeviceInventories",
          },
          {
            text: "Offline",
            url: "/Inventories",
          },
        ],
        hasSubMenu: true,
      },
      {
        text: "Instantaneous check",
        url: "/InventoriesOnline",
        hasSubMenu: false,
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

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />}></Route>
        <Route
          path="/"
          element={
            <Layout header={header} title="DEVICE INVENTORY">
              <Outlet />
            </Layout>
          }
        >
          <Route
            exact
            path="/inventories"
            element={<Inventories flagOffline={true} />}
          />
          <Route
            exact
            path="/inventoriesOnline"
            element={<InventoriesOnline />}
          />
          <Route
            exact
            path="/managementDeviceInventories"
            element={<Inventories />}
          />
          <Route
            exact
            path="/device-management"
            element={<DeviceManagementPage />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
