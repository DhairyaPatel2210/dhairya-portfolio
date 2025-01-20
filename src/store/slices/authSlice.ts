import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { toast } from "sonner";
import { encryptData } from "@/lib/encryption";

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
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

      console.log(response);

      // Verify the response
      if (response?.status !== 200) {
        throw new Error(response.data?.message || "Authentication failed");
      }

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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authenticateWithApiKey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateWithApiKey.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(authenticateWithApiKey.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.error.message || "Authentication failed";
        toast.error(state.error);
      });
  },
});

export const authReducer = authSlice.reducer;
export default authReducer;
