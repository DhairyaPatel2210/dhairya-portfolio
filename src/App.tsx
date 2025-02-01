import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authenticateWithApiKey } from "./store/slices/authSlice";
import { fetchPortfolio } from "./store/slices/portfolioSlice";
import type { AppDispatch, RootState } from "./store/store";

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    isAuthenticated,
    loading: authLoading,
    error: authError,
  } = useSelector((state: RootState) => state.auth);
  const [authAttempted, setAuthAttempted] = useState(false);

  // Handle initial authentication
  useEffect(() => {
    const initializeAuth = async () => {
      if (!authAttempted) {
        setAuthAttempted(true);
        try {
          await dispatch(authenticateWithApiKey()).unwrap();
        } catch (error) {
          console.error("Authentication failed:", error);
        }
      }
    };

    initializeAuth();
  }, [dispatch, authAttempted]);

  // Fetch portfolio data when authenticated
  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        try {
          await dispatch(fetchPortfolio()).unwrap();
        } catch (error) {
          console.error("Failed to fetch portfolio data:", error);
        }
      }
    };

    fetchData();
  }, [dispatch, isAuthenticated]);

  // Debug logs
  useEffect(() => {
    console.log("Auth State:", {
      isAuthenticated,
      authLoading,
      authError,
      authAttempted,
    });
  }, [isAuthenticated, authLoading, authError, authAttempted]);

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <Navbar />
        <main className="pt-16 w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AppContent />
        <Toaster />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
