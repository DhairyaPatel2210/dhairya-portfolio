import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { toast } from "sonner";

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
  endDate: string;
  iconImage: string;
  s3Key: string;
  currentlyWorking: boolean;
}

export interface ProjectsState {
  projects: Project[];
  availableLanguages: string[];
  availableProjectTypes: string[];
  selectedLanguages: string[];
  selectedProjectTypes: string[];
  loading: boolean;
  error: string | null;
  dataFetched: boolean;
}

const initialState: ProjectsState = {
  projects: [],
  availableLanguages: [],
  availableProjectTypes: [],
  selectedLanguages: [],
  selectedProjectTypes: [],
  loading: true,
  error: null,
  dataFetched: false,
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { getState }) => {
    const state = getState() as { projects: ProjectsState };
    // If data is already fetched, don't fetch again
    if (state.projects.dataFetched) {
      return state.projects.projects;
    }
    try {
      const response = await api.get("/api/projects");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      throw error;
    }
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setSelectedLanguages: (state, action: PayloadAction<string[]>) => {
      state.selectedLanguages = action.payload;
    },
    setSelectedProjectTypes: (state, action: PayloadAction<string[]>) => {
      state.selectedProjectTypes = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        // If we're returning cached data, don't update the state
        if (state.dataFetched) {
          state.loading = false;
          return;
        }
        state.projects = action.payload;
        // Extract unique languages and project types
        const languages = new Set<string>();
        const types = new Set<string>();

        action.payload.forEach((project: Project) => {
          project.programmingLanguages.forEach((lang) => languages.add(lang));
          project.projectType.forEach((type) => types.add(type));
        });

        state.availableLanguages = Array.from(languages);
        state.availableProjectTypes = Array.from(types);
        state.loading = false;
        state.dataFetched = true;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch projects";
        toast.error(state.error);
      });
  },
});

export const { setSelectedLanguages, setSelectedProjectTypes } =
  projectsSlice.actions;
export const projectsReducer = projectsSlice.reducer;
export default projectsReducer;
