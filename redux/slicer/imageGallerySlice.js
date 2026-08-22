import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ======================================
// Upload Images
// ======================================
export const uploadImages = createAsyncThunk(
  "gallery/uploadImages",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/images/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload images"
      );
    }
  }
);

// ======================================
// Get All Galleries
// ======================================
export const getAllImages = createAsyncThunk(
  "gallery/getAllImages",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/images");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch galleries"
      );
    }
  }
);

// ======================================
// Get Single Gallery
// ======================================
export const getGalleryById = createAsyncThunk(
  "gallery/getGalleryById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/images/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch gallery"
      );
    }
  }
);

// ======================================
// Delete Gallery
// ======================================
export const deleteGallery = createAsyncThunk(
  "gallery/deleteGallery",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/images/${id}`);
      return { ...data, id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete gallery"
      );
    }
  }
);

const imageGallerySlice = createSlice({
  name: "gallery",

  initialState: {
    galleries: [],
    gallery: null,
    loading: false,
    success: false,
    error: null,
    message: "",
  },

  reducers: {
    resetGalleryState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================
      // Upload Images
      // ======================
      .addCase(uploadImages.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        state.galleries.unshift(action.payload.data);
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // Get All Galleries
      // ======================
      .addCase(getAllImages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllImages.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.galleries = action.payload.data;
      })
      .addCase(getAllImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // Get Single Gallery
      // ======================
      .addCase(getGalleryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGalleryById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.gallery = action.payload.data;
      })
      .addCase(getGalleryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // Delete Gallery
      // ======================
      .addCase(deleteGallery.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        state.galleries = state.galleries.filter(
          (gallery) => gallery._id !== action.payload.id
        );
      })
      .addCase(deleteGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetGalleryState } = imageGallerySlice.actions;

export default imageGallerySlice.reducer;