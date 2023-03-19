// actions.js

import { api } from "../../Interceptor";
import Swale from "sweetalert2";
import { setData } from "./deviceInventorySlice";

export const FETCH_DATA = "FETCH_DATA";
export const SET_DATA = "SET_DATA";
export const API_URL = api.defaults.baseURL;

export const fetchData = (endpoint) => {
  return async (dispatch) => {
    try {
      const { data } = await api.get(`${API_URL}${endpoint}`);
      dispatch(setData(data));
    } catch (err) {
      const message = err?.response?.data?.error ?? err?.error ?? err;
      Swale.fire({
        icon: "error",
        text: `Error when fetchData() ${message}`,
      });
    }
  };
};
