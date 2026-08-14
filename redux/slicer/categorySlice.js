import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// =============================
// CREATE CATEGORY
// =============================
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/categories",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to create category",
        }
      );
    }
  }
);

// =============================
// GET ALL CATEGORY
// =============================
export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/categories");

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch categories",
        }
      );
    }
  }
);

// =============================
// GET SINGLE CATEGORY
// =============================
export const getCategoryById = createAsyncThunk(
  "category/getCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/categories/${id}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch category",
        }
      );
    }
  }
);

// =============================
// UPDATE CATEGORY
// =============================
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/categories/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to update category",
        }
      );
    }
  }
);

// =============================
// DELETE CATEGORY
// =============================
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/categories/${id}`
      );

      return {
        ...response.data,
        id,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to delete category",
        }
      );
    }
  }
);

// =============================
// INITIAL STATE
// =============================
const initialState = {
  categories: [],
  category: null,
  loading: false,
  success: false,
  error: null,
  message: "",
};

// =============================
// SLICE
// =============================
const categorySlice = createSlice({
  name: "category",
  initialState,

  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },

    clearCategoryMessage: (state) => {
      state.message = "";
    },
  },

  extraReducers: (builder) => {

    // CREATE
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.categories.unshift(
          action.payload.category
        );

        state.message =
          action.payload.message;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message;
      });

    // GET ALL
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;

        state.categories =
          action.payload.categories;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message;
      });

    // GET SINGLE
    builder
      .addCase(getCategoryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.loading = false;

        state.category =
          action.payload.category;
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message;
      });

    // UPDATE
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;

        state.success = true;

        state.categories =
          state.categories.map((item) =>
            item._id ===
            action.payload.category._id
              ? action.payload.category
              : item
          );

        state.message =
          action.payload.message;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message;
      });

    // DELETE
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;

        state.categories =
          state.categories.filter(
            (item) =>
              item._id !== action.payload.id
          );

        state.message =
          action.payload.message;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message;
      });
  },
});

export const {
  clearCategoryError,
  clearCategoryMessage,
} = categorySlice.actions;

export default categorySlice.reducer;