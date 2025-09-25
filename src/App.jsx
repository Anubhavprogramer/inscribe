import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import the Router and Routes
import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import TextEditor from "./components/TextEditor";
import { ColorProvider } from "./Contexts/ColorContext";
import MyNotes from "./components/MyNotes";
import PublicNoteViewer from "./components/PublicNoteViewer";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import LandingPage from "./components/LandingPage";

function App() {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Global error handler
    const handleError = (error) => {
      console.error('Global error:', error);
      setError(error.message);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', (event) => {
      handleError(new Error(event.reason));
    });

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ColorProvider>
        <Routes>
          {/* Public routes - available without authentication */}
          <Route path="/share/:noteId" element={<PublicNoteViewer />} />
          
          {/* Authenticated routes */}
          <Route path="/editor/:noteId" element={
            <SignedIn>
              <Navbar />
              <TextEditor />
            </SignedIn>
          } />
          
          <Route path="/" element={
            <>
              <SignedIn>
                <Navbar />
                <MyNotes />
              </SignedIn>
              <SignedOut>
                <LandingPage />
              </SignedOut>
            </>
          } />
        </Routes>
      </ColorProvider>
    </Router>
  );
}

export default App;
