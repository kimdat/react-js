import { apiSlice } from "../api/apiSlice";

export const deviceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDevices: builder.query({
      query: () => ({
        url: "api/devices",
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.devices;
      },
      providesTags: ["Devices"],
    }),
    getDevicesByFilters: builder.query({
      query: (filters) => ({
        url: "api/devices?" + JSON.stringify(filters),
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.devices;
      },
      providesTags: ["Devices"],
    }),

    addNewDevice: builder.mutation({
      query: (newDevice) => {
        if (typeof newDevice === "object") {
          newDevice = [newDevice];
        }

        return {
          url: "api/devices",
          method: "POST",
          body: newDevice,
        };
      },
      invalidatesTags: ["Devices"],
    }),
  }),
});

export const {
  useGetAllDevicesQuery,
  useLazyGetDevicesByFiltersQuery,
  useAddNewDeviceMutation,
} = deviceApiSlice;
