import { useContext, useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { ColorContext } from "../Contexts/ColorContext";
import { useNavigate, useLocation } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSelectedNote } = useContext(ColorContext);
  const { user } = useUser();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // New Note handler
  const handleNewNote = () => {
    setSelectedNote({
      title: "",
      note: "",
      time: new Date().toISOString(),
    });
    navigate("/editor");
  };

  return (
    <nav className={`w-full px-4 sm:px-10 py-4 flex items-center justify-between shadow-md bg-white dark:bg-gray-800 text-black dark:text-white transition-colors duration-300`}>
      {/* Left side: Nav items */}
      <div className="flex items-center gap-4 flex-1">
        {/* Hamburger for mobile */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setShowMobileMenu(m => !m)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <span className="sr-only">Menu</span>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
         {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <button className={`text-lg font-semibold hover:text-purple-600 transition`} onClick={() => navigate("/")}>My Notes</button>
          {/* <button className="flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow hover:from-purple-600 hover:to-blue-600 transition" onClick={handleNewNote}><MdAdd size={20} /> New Note</button> */}
        </div>
      </div>

      {/* Center: Logo */}
      <div className="flex items-center justify-center">
        <span className="text-3xl font-extrabold tracking-tight cursor-pointer select-none text-purple-600 hover:text-purple-800 transition" onClick={() => navigate("/")}>inscribe</span>
      </div>

      {/* Right side: user only */}
      <div className="flex items-center gap-4 flex-1 justify-end">
        <ThemeToggle />
        
        <SignedOut>
          <SignInButton>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-semibold transition">Sign In</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="relative group">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="avatar" className="w-10 h-10 rounded-full border-2 border-purple-400 shadow cursor-pointer" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-xl cursor-pointer border-2 border-purple-400 shadow">{user?.firstName?.[0] || user?.emailAddress?.[0] || "U"}</div>
            )}
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50 p-4 flex flex-col gap-2">
              <div className="font-bold text-lg">{user?.fullName || user?.emailAddress}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 break-all">{user?.primaryEmailAddress?.emailAddress}</div>
              <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </SignedIn>
      </div>

      {/* Mobile menu dropdown */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-16 left-4 bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl shadow-lg flex flex-col gap-2 p-4 z-50 min-w-[160px]">
          <button className={`text-lg font-semibold hover:text-purple-600 dark:hover:text-purple-400 transition text-left ${location.pathname === '/' ? 'underline underline-offset-4' : ''}`} onClick={() => {navigate("/"); setShowMobileMenu(false);}}>My Notes</button>
          <button className="flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow hover:from-purple-600 hover:to-blue-600 transition" onClick={() => {handleNewNote(); setShowMobileMenu(false);}}><MdAdd size={20} /> New Note</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
