import { apiSlice } from "../api/apiSlice";

export const provinceApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllProvinces: builder.query({
            query: () => ({
                url: 'api/provinces',
                method: 'GET',
            }),
            transformResponse: (response) => {
                return response.provinces;
            },
            providesTags: ["Provinces"],
        })
    })
});

export const { useGetAllProvincesQuery } = provinceApiSlice;