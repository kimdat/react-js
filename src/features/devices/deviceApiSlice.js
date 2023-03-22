import { apiSlice } from "../api/apiSlice";

export const deviceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDevices: builder.query({
      query: (params) => ({
        url: "api/devices",
        method: "GET",
        params: {...params}
      }),
      transformResponse: (response) => {
        return {
          devices: response.devices,
          totalRowCount: response.totalRowCount,
        };
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
  useLazyGetDevicesQuery,
  useAddNewDeviceMutation,
  useDeleteDevicesMutation,
  useLazyCheckDuplicateQuery,
  useEditDeviceMutation,
} = deviceApiSlice;
