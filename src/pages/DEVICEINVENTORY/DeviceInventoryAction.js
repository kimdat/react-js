// actions.js

import { api } from "../../Interceptor";
import Swale from "sweetalert2";

export const FETCH_DATA = "FETCH_DATA";

export const API_URL = api.defaults.baseURL;

export const fetchData = (endpoint) => {
  return async (dispatch) => {
    try {
      const { data } = await api.get(`${API_URL}${endpoint}`);

      dispatch({
        type: FETCH_DATA,
        payload: { data: data, error: null },
      });
    } catch (err) {
      const message = err?.response?.data?.error ?? err?.error ?? err;
      Swale.fire({
        icon: "error",
        text: `Error when fetchData() ${message}`,
      });
      dispatch({
        type: FETCH_DATA,
        payload: { data: null, error: err },
      });
    }
  };
};
