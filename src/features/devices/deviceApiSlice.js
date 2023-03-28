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
    exportDevicesToFile: builder.query({
      queryFn: async (_, __, ___, baseQuery) => {
        const result = await baseQuery({
          url: 'api/devices/export',
          responseHandler: ((response) => response.blob()),
        });

        //create object url
        var hiddenElement = document.createElement('a');
        var url = window.URL || window.webkitURL;
        var blob = url.createObjectURL(result.data);
        hiddenElement.href = blob;
        hiddenElement.target = '_blank';

        //get date and time
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
        
        //file name
        hiddenElement.download = `devices-${date}-${time}.xlsx`;

        hiddenElement.click();
        return { data: null }
      }
    }),
  }),
});

export const {
  useLazyGetDevicesQuery,
  useAddNewDeviceMutation,
  useDeleteDevicesMutation,
  useLazyCheckDuplicateQuery,
  useEditDeviceMutation,
  useLazyExportDevicesToFileQuery,
} = deviceApiSlice;
