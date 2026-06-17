import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axios";

const authStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      loading: false,
      error: null,

      setAccessToken: (token) => set({ accessToken: token }),

      // Auth actions
      signUp: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post("/auth/signup", data);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || "Sign up failed",
          });
          throw error;
        }
      },

      signIn: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post("/auth/signin", data);

          set({
            user: response?.data?.data?.user,
            accessToken: response?.data?.data?.accessToken,
            loading: false,
          });

          return response.data;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || "Sign in failed",
          });
          throw error;
        }
      },

      signOut: () => {
        set({ user: null, accessToken: null });
      },

      changeProfile: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await api.put("/auth/update-profile", data);
          set((state) => ({
            user: { ...state.user, name: response.data.data.user.name },
            loading: false,
          }));
          return response.data;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || "Update profile failed",
          });
          throw error;
        }
      },

      changePassword: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await api.put("/auth/change-password", data);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || "Change password failed",
          });
          throw error;
        }
      },

      sendCode: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post(
            "/auth/send-verification-email",
            data,
          );
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || "Send code failed",
          });
          throw error;
        }
      },

      verifyUser: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post("/auth/verify-user", data);
          set((state) => ({
            user: { ...state.user, isVerified: true },
            loading: false,
          }));
          return response.data;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || "Verify user failed",
          });
          throw error;
        }
      },

      sendResetCode: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post("/auth/forgot-password", data);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || "Send reset code failed",
          });
          throw error;
        }
      },

      resetPassword: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post("/auth/reset-password", data);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || "Reset password failed",
          });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",

      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
);

export default authStore;
