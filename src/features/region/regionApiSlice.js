import { apiSlice } from "../api/apiSlice";

export const regionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRegions: builder.query({
      query: () => ({
        url: "api/regions",
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.regions.sort((a, b) => a.order - b.order);
      },
      providesTags: ["Regions"],
    }),
  }),
});

export const { useGetAllRegionsQuery } = regionApiSlice;
