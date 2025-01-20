import { configureStore } from "@reduxjs/toolkit";
import type { PortfolioState } from "./slices/portfolioSlice";
import type { ProjectsState } from "./slices/projectsSlice";
import type { AuthState } from "./slices/authSlice";
import portfolioReducer from "./slices/portfolioSlice";
import projectsReducer from "./slices/projectsSlice";
import authReducer from "./slices/authSlice";
import contactReducer from "./slices/contactSlice";
import type { ContactState } from "./slices/contactSlice";

export interface RootState {
  portfolio: PortfolioState;
  projects: ProjectsState;
  auth: AuthState;
  contact: ContactState;
}

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
    projects: projectsReducer,
    auth: authReducer,
    contact: contactReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
