import { apiSlice } from "../api/apiSlice";

export const provinceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProvinces: builder.query({
      query: (params) => ({
        url: "api/provinces",
        method: "GET",
        params: {...params}
      }),
      transformResponse: (response) => {
        return response.provinces.sort((a, b) => a.order - b.order);
      },
      providesTags: ["Provinces"],
    }),
  }),
});

export const {
  useGetProvincesQuery,
  useLazyGetProvincesQuery,
} = provinceApiSlice;
