import { apiSlice } from "../api/apiSlice";

export const deviceTypeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDeviceTypes: builder.query({
      query: () => ({
        url: "api/device-types",
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.provinces;
      },
      providesTags: ["DeviceTypes"],
    }),
  }),
});

export const { useGetAllDeviceTypesQuery } = deviceTypeApiSlice;