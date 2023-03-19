// reducer.js
import { FETCH_DATA } from "./DeviceInventoryAction";

const initialState = {
  data: null,
  error: null,
};

const DeviceInventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DATA:
      return {
        ...state,
        data: action.payload.data,
        error: action.payload.error,
      };

    default:
      return state; // add default case to return current state
  }
};

export default DeviceInventoryReducer;
