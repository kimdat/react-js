import { apiSlice } from "../api/apiSlice";

export const provinceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProvinces: builder.query({
      query: () => ({
        url: "api/provinces",
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.provinces.sort((a, b) => a.order - b.order);
      },
      providesTags: ["Provinces"],
    }),
  }),
});

export const { useGetAllProvincesQuery } = provinceApiSlice;
