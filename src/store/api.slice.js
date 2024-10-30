import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "https://fakestoreapi.com" }),
    tagTypes: ["MyProducts"],  // ? refetch api when new add added or updated or removed.
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => "/products",
            providesTags: ["MyProducts"],
            transformErrorResponse: (data) => data.reverse(),  // ? modify response
        }),


        addProduct: builder.mutation({
            query: (payload) => ({
                url: "/products",
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["MyProducts"],
            async onQueryStarted(payload, { dispatch, queryFulfilled }) {  // ? When a user submits a new product, it should instantly show up in the list. If there’s an error adding the product, it should be removed from the list.
                const patchResult = dispatch(
                    api.util.updateQueryData("getProducts", undefined, (response) => {
                        response.push(payload)
                    })
                );

                try {
                    await queryFulfilled;
                }
                catch {
                    patchResult.undo();
                }
            }
        }),



        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/productsc/${id}`,
                method: "DELETE"
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                // Optimistically update the product list
                const patchResult = dispatch(
                    api.util.updateQueryData("getProducts", undefined, (draft) => {
                        // Remove the product from the draft
                        return draft.filter(product => product.id !== id);
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ["MyProducts"]
        })
    })
})


export const { useGetProductsQuery, useAddProductMutation, useDeleteProductMutation } = api;