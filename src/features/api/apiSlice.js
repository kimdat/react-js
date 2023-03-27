import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost/APILOGIN",
  prepareHeaders: (headers, { getState }) => {
    const token = process.env.REACT_APP_TOKEN_KEY;
    if (token) {
      headers.set("Authorization", `Bear ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery: baseQuery,
  tagTypes: ["Devices", "Provinces", "Regions", "DeviceStatus", "DeviceTypes"],
  endpoints: (builder) => ({}),
});
