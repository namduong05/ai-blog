// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import api from "../api/axios";

// const useStore = create(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,

//       loading: false,
//       error: null,

//       categories: [],

//       // Auth actions
//       signUp: async (data) => {
//         set({ loading: true, error: null });
//         try {
//           const response = await api.post("/auth/signup", data);
//           set({ loading: false });
//           return response.data;
//         } catch (error) {
//           set({
//             loading: false,
//             error: error.response?.data?.message || "Sign up failed",
//           });
//           throw error;
//         }
//       },

//       signIn: async (data) => {
//         set({ loading: true, error: null });
//         try {
//           const response = await api.post("/auth/signin", data);

//           set({
//             user: response?.data?.data?.user,
//             token: response?.data?.data?.token,
//             loading: false,
//           });

//           return response.data;
//         } catch (error) {
//           set({
//             loading: false,
//             error: error.response?.data?.message || "Sign in failed",
//           });
//           throw error;
//         }
//       },

//       signOut: () => {
//         set({ user: null, token: null });
//       },

//       //   Category actions
//       getCategories: async (page = 1, q) => {
//         set({ loading: true, error: null });
//         try {
//           const response = await api.get("/category", {
//             headers: {
//               Authorization: `Bearer ${useStore.getState().token}`,
//             },
//             params: {
//               page,
//               q,
//             },
//           });
//           set({
//             categories: [...response.data.data.categories],
//             loading: false,
//           });
//           return response.data;
//         } catch (error) {
//           set({
//             loading: false,
//             error: error.response?.data?.message || "Fetch categories failed",
//           });
//           throw error;
//         }
//       },

//       getCategoryById: async (id) => {
//         set({ loading: true, error: null });
//         try {
//           const response = await api.get(`/category/${id}`, {
//             headers: {
//               Authorization: `Bearer ${useStore.getState().token}`,
//             },
//           });
//           set({ loading: false });
//           return response.data.data;
//         } catch (err) {
//           set({
//             loading: false,
//             error: err.response?.data?.message || "Fetch category failed",
//           });
//           throw err;
//         }
//       },

//       createCategory: async (data) => {
//         set({ loading: true, error: null });
//         try {
//           const response = await api.post("/category", data, {
//             headers: {
//               Authorization: `Bearer ${useStore.getState().token}`,
//             },
//           });
//           set({
//             loading: false,
//           });
//           return response.data;
//         } catch (error) {
//           set({
//             loading: false,
//             error: error.response?.data?.message || "Create category failed",
//           });
//           throw error;
//         }
//       },

//       updateCategory: async (id, data) => {
//         set({ loading: true, error: null });
//         try {
//           const response = await api.put(`/category/${id}`, data, {
//             headers: {
//               Authorization: `Bearer ${useStore.getState().token}`,
//             },
//           });
//           set({
//             categories: useStore
//               .getState()
//               .categories.map((cat) =>
//                 cat._id === id ? response.data.data : cat,
//               ),
//             loading: false,
//           });
//           return response.data;
//         } catch (error) {
//           set({
//             loading: false,
//             error: error.response?.data?.message || "Update category failed",
//           });
//           throw error;
//         }
//       },

//       deleteCategory: async (id) => {
//         set({ loading: true, error: null });
//         try {
//           const response = await api.delete(`/category/${id}`, {
//             headers: {
//               Authorization: `Bearer ${useStore.getState().token}`,
//             },
//           });
//           set({
//             categories: useStore
//               .getState()
//               .categories.filter((cat) => cat._id !== id),
//             loading: false,
//           });
//           return response.data;
//         } catch (error) {
//           set({
//             loading: false,
//             error: error.response?.data?.message || "Delete category failed",
//           });
//           throw error;
//         }
//       },
//     }),
//     {
//       name: "auth-storage",

//       partialize: (state) => ({
//         user: state.user,
//         token: state.token,
//       }),
//     },
//   ),
// );

// export default useStore;
