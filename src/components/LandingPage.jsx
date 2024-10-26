import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import React from "react";
import img1 from "../assets/img1.png";
import logo from "../assets/logo.png";
import { BsGithub, BsInstagram, BsLinkedin, BsYoutube } from "react-icons/bs";

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-b from-purple-500 to-white min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="p-5 md:p-10 bg-black text-white animate-fade-down">
        <ul className="flex justify-between items-center">
          <img src={logo} alt="Logo" className="w-20 md:w-28 hover:scale-105 transition-transform duration-300" />
          <li className="flex gap-4 md:gap-10">
            <SignUpButton>
              <button className="bg-purple-600 hover:bg-purple-700 w-20 h-7 rounded-lg text-xs md:text-sm transition duration-300 transform hover:scale-105">
                Sign Up
              </button>
            </SignUpButton>
            <SignInButton>
              <button className="bg-purple-600 hover:bg-purple-700 w-20 h-7 rounded-lg text-xs md:text-sm transition duration-300 transform hover:scale-105">
                Sign In
              </button>
            </SignInButton>
          </li>
        </ul>
      </nav>

      {/* Body */}
      <div className="flex flex-col md:flex-row justify-center items-center h-full px-5 md:px-10 gap-5 md:gap-7 mt-10 md:mt-0">
        <div className="text-start w-full md:w-1/2 flex flex-col gap-5 animate-fade-right">
          <span className="text-7xl sm:text-4xl md:text-7xl font-extrabold  font-lexend">Inscribe</span>
          <p className="text-4xl sm:text-5xl lg:text-5xl font-bold leading-tight">
            Your personal Note-Taking App
          </p>
          <span className="text-md md:text-lg">Where your thoughts find their perfect place.</span>
          <SignInButton>
            <button className="bg-purple-700 w-32 md:w-40 text-white py-2 md:py-3 rounded-xl text-sm md:text-md transition-transform transform hover:scale-105 hover:translate-y-1 duration-300">
              Get Started
            </button>
          </SignInButton>
        </div>
        <div className="w-full md:w-1/2 flex justify-center md:m-20 animate-fade-left">
          <img className="w-2/3 md:w-full" src={img1} alt="Illustration" />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white p-5 flex flex-col justify-center items-center mt-10 md:mt-20 animate-fade-up">
        <span className="text-center text-xs md:text-base">
          Simplicity meets creativity – inscribe your ideas effortlessly.
        </span>
        <div className="flex gap-5 md:gap-10 my-4">
          <a href="#" aria-label="YouTube" className="transition-transform hover:scale-110">
            <BsYoutube />
          </a>
          <a href="#" aria-label="GitHub" className="transition-transform hover:scale-110">
            <BsGithub />
          </a>
          <a href="#" aria-label="Instagram" className="transition-transform hover:scale-110">
            <BsInstagram />
          </a>
          <a href="#" aria-label="LinkedIn" className="transition-transform hover:scale-110">
            <BsLinkedin />
          </a>
        </div>
        <span className="text-xs md:text-sm">© 2021 Inscribe</span>
      </footer>
    </div>
  );
};

export default LandingPage;
