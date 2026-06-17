import api from "../api/axios";
import authStore from "./authStore";
import { create } from "zustand";

const categoryStore = create((set) => ({
  categories: [],

  loading: false,
  error: null,

  //   Category actions
  getCategories: async (page = 1, q) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/category", {
        params: {
          page,
          q,
        },
      });
      set({
        categories: [...response.data.data.categories],
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Fetch categories failed",
      });
      throw error;
    }
  },

  getAllCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/category");
      set({
        categories: [...response.data.data.categories],
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Fetch categories failed",
      });
      throw error;
    }
  },

  getCategoryById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/category/${id}`);
      set({ loading: false });
      return response.data.data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Fetch category failed",
      });
      throw err;
    }
  },

  createCategory: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/category", data);
      set((state) => ({
        categories: [...state.categories, response.data.data.newCategory],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Create category failed",
      });
      throw error;
    }
  },

  updateCategory: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/category/${id}`, data);
      set({
        categories: categoryStore
          .getState()
          .categories.map((cat) =>
            cat._id === id ? response.data.data.updatedCategory : cat,
          ),
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Update category failed",
      });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/category/${id}`);
      set({
        categories: categoryStore
          .getState()
          .categories.filter((cat) => cat._id !== id),
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Delete category failed",
      });
      throw error;
    }
  },
}));
export default categoryStore;
