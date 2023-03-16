import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL || "http://localhost:8080/",
    prepareHeaders: (headers, { getState }) => {
        const token = process.env.REACT_APP_TOKEN_KEY;
        if (token) {
            headers.set('Authorization', `Bear ${token}`);
        }
        return headers;
    }
});

export const apiSlice = createApi({
    baseQuery: baseQuery,
    tagTypes: ['Devices'],
    endpoints: builder => ({})
});