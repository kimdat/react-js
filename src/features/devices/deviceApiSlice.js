import { apiSlice } from "../api/apiSlice";

export const deviceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDevices: builder.query({
      query: (params) => ({
        url: "api/devices",
        method: "GET",
        params: { ...params },
      }),
      transformResponse: (response) => {
        return {
          devices: response.devices.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }),
          totalRowCount: response.totalRowCount,
        };
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
    editDevice: builder.mutation({
      query: ({deviceId, data}) => {
        return {
          url: `api/devices/${deviceId}`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Devices"],
    }),
    checkDuplicate: builder.query({
      query: ({ip, deviceName}) => {
        const name = ip ? "Ip" : "DeviceName";
        const value = ip ? ip : deviceName;
        const formData = new FormData();
        formData.append("name", name);
        formData.append("value", value);
        return ({
          url: 'checkDuplicate',
          method: "POST",
          body: formData,
        });
      },
      transformResponse: (response) => {
        return response?.duplicate === true;
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
