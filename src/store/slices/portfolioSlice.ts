import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { toast } from "sonner";
import { RootState } from "../store";

export interface Project {
  _id: string;
  title: string;
  description: string;
  programmingLanguages: string[];
  githubRepo: string;
  liveWebLink: string;
  projectType: string[];
  specialNote: string;
  startDate: string;
  iconImage: string;
  currentlyWorking: boolean;
}

export interface Experience {
  _id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string | null;
  isCurrentJob: boolean;
  responsibilities: string;
  technologies: string[];
}

export interface PortfolioState {
  name: string;
  about: string;
  status: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    image: {
      s3Key: string;
      s3Url: string;
    };
  };
  analytics?: {
    googleAnalyticsId: string;
  };
  featuredProjects: Project[];
  featuredSocials: {
    _id: string;
    name: string;
    link: string;
    s3Link: string;
  }[];
  resumes: {
    url: string;
    displayName: string;
  }[];
  education: {
    _id: string;
    universityName: string;
    major: string;
    degree: string;
    startDate: string;
    endDate: string | null;
    relatedCourseworks: string[];
    gpa: number;
    isPursuing: boolean;
  }[];
  experience: Experience[];
  loading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  name: "",
  about: "",
  status: "",
  seo: {
    title: "",
    description: "",
    keywords: [],
    image: {
      s3Key: "",
      s3Url: "",
    },
  },
  featuredProjects: [],
  featuredSocials: [],
  resumes: [],
  education: [],
  experience: [],
  loading: true,
  error: null,
};

export const fetchPortfolio = createAsyncThunk(
  "portfolio/fetchPortfolio",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Check if we're authenticated
      const state = getState() as RootState;
      if (!state.auth.isAuthenticated) {
        throw new Error("Authentication required");
      }

      const response = await api.get("/portfolio", {
        withCredentials: true, // Ensure cookies are included
      });

      if (!response.data) {
        throw new Error("No data received from server");
      }

      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch portfolio data:", error);

      if (error.message === "Authentication required") {
        return rejectWithValue("Please authenticate to view portfolio data");
      }

      if (error.code === "ERR_NETWORK") {
        return rejectWithValue(
          "Unable to connect to the server. Please check your internet connection."
        );
      }

      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch portfolio data"
      );
    }
  }
);

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        return {
          ...action.payload,
          loading: false,
          error: null,
        };
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch portfolio data";
        toast.error(state.error);
      });
  },
});

export const portfolioReducer = portfolioSlice.reducer;
export default portfolioReducer;
