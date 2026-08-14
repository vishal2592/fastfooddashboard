import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";


// =========================
// ADMIN REGISTER
// =========================

export const registerAdmin = createAsyncThunk(
  "admin/registerAdmin",

  async (adminData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/admin/register",
        adminData
      );

      return response.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Something went wrong",
        }
      );
    }
  }
);


// =========================
// ADMIN LOGIN
// =========================

export const loginAdmin = createAsyncThunk(
  "admin/loginAdmin",

  async (loginData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/admin/login",
        loginData
      );

      return response.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Something went wrong",
        }
      );
    }
  }
);


// =========================
// GET ADMIN PROFILE
// =========================

export const getAdminProfile = createAsyncThunk(
  "admin/getAdminProfile",

  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        "/admin/profile"
      );

      return response.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Something went wrong",
        }
      );
    }
  }
);


// =========================
// ADMIN LOGOUT
// =========================

export const logoutAdmin = createAsyncThunk(
  "admin/logoutAdmin",

  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/admin/logout"
      );

      return response.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Something went wrong",
        }
      );
    }
  }
);


// =========================
// INITIAL STATE
// =========================

const initialState = {
  admin: null,

  loading: true,

  error: null,

  success: false,

  message: "",
};


// =========================
// ADMIN SLICE
// =========================

const adminSlice = createSlice({

  name: "admin",

  initialState,

  reducers: {

    clearAdminError: (state) => {
      state.error = null;
    },

    clearAdminMessage: (state) => {
      state.message = "";
    },

  },

  extraReducers: (builder) => {

    // =================================
    // REGISTER ADMIN
    // =================================

    builder

      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.admin = action.payload.admin;

        state.message = action.payload.message;
      })

      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.success = false;

        state.error = action.payload?.message || "Registration failed";
      });


    // =================================
    // LOGIN ADMIN
    // =================================

    builder

      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.admin = action.payload.admin;

        state.message = action.payload.message;
      })

      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.success = false;

        state.error = action.payload?.message || "Login failed";
      });


    // =================================
    // GET ADMIN PROFILE
    // =================================

    builder

      .addCase(getAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.admin = action.payload.admin;
      })

      .addCase(getAdminProfile.rejected, (state, action) => {
        state.loading = false;

        state.admin = null; // ADD THIS

        state.error =
          action.payload?.message || "Failed to get admin profile";
      });


    // =================================
    // LOGOUT ADMIN
    // =================================

    builder

      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(logoutAdmin.fulfilled, (state, action) => {
        state.loading = false;

        // IMPORTANT
        state.success = false;

        state.admin = null;

        state.message = action.payload.message;
      })

      .addCase(logoutAdmin.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message || "Logout failed";
      });

  },
});


export const {
  clearAdminError,
  clearAdminMessage,
} = adminSlice.actions;


export default adminSlice.reducer;