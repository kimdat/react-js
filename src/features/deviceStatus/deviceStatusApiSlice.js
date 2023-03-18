import { apiSlice } from "../api/apiSlice";

export const deviceStatusApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDeviceStatus: builder.query({
      query: () => ({
        url: "api/device-status",
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.status;
      },
      providesTags: ["DeviceStatus"],
    }),
  }),
});

export const { useGetAllDeviceStatusQuery } = deviceStatusApiSlice;
