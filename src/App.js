import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import LogoutPage from "./pages/Logout";
import Inventories from "./pages/Inventories/Inventories";
import Layout from "./LAYOUT/Layout.js";
import Inventories1 from "./pages/Inventories1";
import InventoriesOnline from "./pages/InventoriesOnline/InventoriesOnline";

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
          <Route exact path="/logout" element={<LogoutPage />} />
          <Route
            exact
            path="/inventories"
            element={<Layout><Inventories /></Layout>}
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
          <Route exact path="/inventories1" element={<Inventories1 />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
