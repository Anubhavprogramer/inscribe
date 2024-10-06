import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import the Router and Routes
import "./App.css";
import Navbar from "./components/Navbar";
import TextEditor from "./components/TextEditor";
import { ColorProvider } from "./Contexts/ColorContext";
import MyNotes from "./components/MyNotes";
import LoginComp from "./components/LoginComp";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

function App() {
  return (
    <Router>
      <SignedIn>
        <ColorProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<TextEditor />} />
            <Route path="/myNotes" element={<MyNotes />} />
          </Routes>
        </ColorProvider>
      </SignedIn>

      <SignedOut>
        <Routes>
          <Route path="/" element={<LoginComp />} />
        </Routes>
      </SignedOut>
    </Router>
  );
}

export default App;
