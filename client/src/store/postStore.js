import { create } from "zustand";
import api from "../api/axios";
import authStore from "./authStore";

const postStore = create((set) => ({
  posts: [],

  loading: false,
  error: null,

  // Post actions
  getPosts: async (page = 1, q, category) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/post", {
        params: {
          page,
          q,
          category,
        },
      });
      set({
        posts: [...response.data.data.posts],
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Fetch posts failed",
      });
      throw error;
    }
  },

  getMyPosts: async (page = 1, q, category) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/post/my-posts", {
        params: {
          page,
          q,
          category,
        },
      });
      set({
        posts: [...response.data.data.posts],
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Fetch posts failed",
      });
      throw error;
    }
  },

  getPostById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/post/${id}`);
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Fetch post failed",
      });
      throw error;
    }
  },

  createPost: async (data) => {
    set({ loading: true, error: null });
    try {
      const reqPost = {
        title: data.title,
        desc: data.desc,
        category: data.category,
      };
      if (data.file && data.file.length > 0) {
        const formData = new FormData();
        formData.append("image", data.file[0]);
        const responseFile = await api.post("/file/upload", formData);
        reqPost.file = responseFile.data.fileId;
      }

      const responsePost = await api.post("/post", reqPost);

      set((state) => ({
        posts: [...state.posts, responsePost.data.data.newPost],
        loading: false,
      }));
      return responsePost.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Create post failed",
      });
      throw error;
    }
  },

  updatePost: async (id, data, fileId, imageId) => {
    set({ loading: true, error: null });
    try {
      const reqPost = {
        title: data.title,
        desc: data.desc,
        category: data.category,
      };

      if (data.file && data.file.length > 0) {
        const formData = new FormData();
        formData.append("image", data.file[0]);
        const responseFile = await api.post("/file/upload", formData);
        reqPost.file = responseFile.data.fileId;
      }

      if (imageId && fileId) {
        await api.delete("/file/delete", {
          data: { fileId, imageId },
        });
      }

      const responsePost = await api.put(`/post/${id}`, reqPost);

      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === id ? responsePost.data.data.updatedPost : post,
        ),
        loading: false,
      }));
      return responsePost.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Update post failed",
      });
      throw error;
    }
  },

  deletePost: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/post/${id}`);

      console.log(response);

      const fileId = response.data.data?.deletedPost?.file?._id;
      const imageId = response.data.data?.deletedPost?.file?.imageId;
      if (fileId && imageId) {
        await api.delete("/file/delete", {
          data: { fileId, imageId },
        });

        console.log(fileId, imageId);
      }
      set((state) => ({
        posts: state.posts.filter((post) => post._id !== id),
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Delete post failed",
      });
      throw error;
    }
  },
}));

export default postStore;
