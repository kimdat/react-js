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
        // if (typeof newDevice === "object") {
        //   newDevice = [newDevice];
        // }

        return {
          url: "api/devices",
          method: "POST",
          body: newDevice,
        };
      },
      invalidatesTags: ["Devices"],
    }),
    editDevice: builder.mutation({
      query: (deviceId, device) => {
        return {
          url: `api/devices/${deviceId}`,
          method: "POST",
          body: device,
        };
      },
      invalidatesTags: ["Devices"],
    }),
    checkDuplicate: builder.query({
      query: ({ip, deviceName}) => {
        const formData = new FormData();
        formData.append("device", JSON.stringify({
          ip: ip ? ip : "",
          deviceName: deviceName ? deviceName : ""
        }));
        return ({
          url: 'checkDuplicate',
          method: "POST",
          body: formData,
        });
      },
      transformResponse: (response) => {
        return response?.duplicate === true;
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
  useLazyCheckDuplicateQuery,
  useEditDeviceMutation,
} = deviceApiSlice;
