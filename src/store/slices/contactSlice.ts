import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "@/lib/axios";

interface ContactInfo {
  location: string;
  personalEmail: string;
  fromEmail: string;
  sendGridApiKey: string;
}

export interface ContactState {
  ownerLocation: string;
  loading: boolean;
  error: string | null;
}

const initialState: ContactState = {
  ownerLocation: "",
  loading: false,
  error: null,
};

export const fetchOwnerLocation = createAsyncThunk(
  "contact/fetchOwnerLocation",
  async () => {
    try {
      const response = await api.get("/api/contact");
      // Extract just the location from the contact data
      const contactData = response.data?.contact as ContactInfo;
      return contactData?.location || "";
    } catch (error) {
      console.error("Error fetching location:", error);
      throw error;
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnerLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnerLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerLocation = action.payload;
        state.error = null;
      })
      .addCase(fetchOwnerLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch owner location";
        toast.error(state.error);
      });
  },
});

export default contactSlice.reducer;
