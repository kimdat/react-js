import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { Provider } from "react-redux";
import store from './app/store';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>
);
