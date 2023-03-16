import { apiSlice } from "../api/apiSlice";

export const deviceApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllDevices: builder.query({
            query: () => ({
                url: 'api/devices',
                method: 'GET',
            }),
            transformResponse: (response) => {
                return response.devices;
            },
            providesTags: ["Devices"],
        })
    })
});

export const { useGetAllDevicesQuery } = deviceApiSlice;