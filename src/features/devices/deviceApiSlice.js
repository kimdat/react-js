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
        return {
          url: "api/devices",
          method: "POST",
          body: newDevice,
        };
      },
      invalidatesTags: ["Devices"],
    }),
    checkDuplicate: builder.query({
      query: ({ name, value }) => {
        const formData = new FormData();
        formData.append(name, value);
        return {
          url: "checkDuplicate",
          method: "POST",
          body: formData,
        };
      },
    }),
    deleteDevices: builder.mutation({
      query: (deviceIdList) => ({
        url: `api/devices/delete`,
        method: "POST",
        body: {
          list: deviceIdList,
        },
      }),
      invalidatesTags: ["Devices"],
    }),
  }),
});

export const {
  useGetAllDevicesQuery,
  useLazyGetDevicesByFiltersQuery,
  useAddNewDeviceMutation,
  useDeleteDevicesMutation,
} = deviceApiSlice;
