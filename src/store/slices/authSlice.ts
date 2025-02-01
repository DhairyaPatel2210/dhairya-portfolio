import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { toast } from "sonner";
import { encryptData } from "@/lib/encryption";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
  user: null,
};

export const authenticateWithApiKey = createAsyncThunk(
  "auth/authenticateWithApiKey",
  async (_, { rejectWithValue }) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    const email = import.meta.env.VITE_EMAIL;

    try {
      // Encrypt the entire payload
      const encrypted_key = await encryptData(apiKey);

      const response = await api.post("/api/users/auth/api-key", {
        encryptedKey: encrypted_key,
        email: email,
      });

      // Verify the response
      if (response?.status !== 200) {
        throw new Error(response.data?.message || "Authentication failed");
      }

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);

      return response.data;
    } catch (error: any) {
      console.error("Authentication error:", error);

      if (error.code === "ERR_NETWORK") {
        return rejectWithValue(
          "Unable to connect to the server. Please check your internet connection or try again later."
        );
      }

      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Authentication failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateWithApiKey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateWithApiKey.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(authenticateWithApiKey.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.error.message || "Authentication failed";
        state.token = null;
        state.user = null;
        toast.error(state.error);
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
export default authReducer;
