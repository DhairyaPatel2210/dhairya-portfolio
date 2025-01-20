import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authenticateWithApiKey } from "./store/slices/authSlice";
import { fetchPortfolio } from "./store/slices/portfolioSlice";
import type { AppDispatch, RootState } from "./store/store";

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();
  const authAttemptedRef = useRef(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!authAttemptedRef.current) {
      authAttemptedRef.current = true;
      dispatch(authenticateWithApiKey());
    }
  }, [dispatch]);

  // Fetch portfolio data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPortfolio());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <Navbar />
        <main className="pt-16 w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
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
