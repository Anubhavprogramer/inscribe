import React, { useContext, useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import ColorPicker from "./ColorPicker";
import Button from "./Button";
import { ColorContext } from "../Contexts/ColorContext";
import { useNavigate } from "react-router-dom";



function Navbar() {
  const navigate = useNavigate();
  const { color, setColor, textColor, settextColor } = useContext(ColorContext); // Access the color and functions from context
  const [isBackgroundPickerOpen, setIsBackgroundPickerOpen] = useState(false); // Control background color picker
  const [isTextPickerOpen, setIsTextPickerOpen] = useState(false); // Control text color picker

  // Toggle background color picker
  const toggleBackgroundColorPicker = () => {
    setIsBackgroundPickerOpen(!isBackgroundPickerOpen);
    setIsTextPickerOpen(false); // Close the text color picker if it's open
  };

  // Toggle text color picker
  const toggleTextColorPicker = () => {
    setIsTextPickerOpen(!isTextPickerOpen);
    setIsBackgroundPickerOpen(false); // Close the background color picker if it's open
  };

  return (
    <div className="bg-black text-white flex justify-between p-5">
      <div className="flex gap-5 justify-center items-center">
        <a className="text-3xl" href="/editor">
          inscribe
        </a>
        <a href="/"  className="text-md sm:text-sm">
          My Notes
        </a>
      </div>
      <div className="flex justify-center items-center gap-5">
        {/* Button for text color picker */}
        <Button text={"🖉"} color={"Black"} toggleColorPicker={toggleTextColorPicker} />
        {isTextPickerOpen && (
          <div className="absolute top-20 right-5 p-3 rounded shadow-lg bg-white">
            <ColorPicker color={textColor} setColor={settextColor} toggleColorPicker={toggleTextColorPicker} />
          </div>
        )}

        {/* Button for background color picker */}
        <Button toggleColorPicker={toggleBackgroundColorPicker} color={color} />
        {isBackgroundPickerOpen && (
          <div className="absolute top-20 right-5 p-3 rounded shadow-lg bg-white">
            <ColorPicker color={color} setColor={setColor} toggleColorPicker={toggleBackgroundColorPicker} />
          </div>
        )}

        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}

export default Navbar;
