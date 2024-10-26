import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import the Router and Routes
import "./App.css";
import Navbar from "./components/Navbar";
import TextEditor from "./components/TextEditor";
import { ColorProvider } from "./Contexts/ColorContext";
import MyNotes from "./components/MyNotes";
import LoginComp from "./components/LoginComp";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <Router>
      <SignedIn>
        <ColorProvider>
          <Navbar />
          <Routes>
            <Route path="/editor" element={<TextEditor />} />
            <Route path="/" element={<MyNotes />} />
          </Routes>
        </ColorProvider>
      </SignedIn>

      <SignedOut>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
        </Routes>
      </SignedOut>
    </Router>
  );
}

export default App;
