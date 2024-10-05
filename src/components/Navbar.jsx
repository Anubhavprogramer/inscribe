import React, { useContext } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import ColorPicker from "./ColorPicker";
import Button from "./Button";
import { ColorContext } from "../Contexts/ColorContext";

function Navbar() {
  const {color,setColor, isPickerOpen, toggleColorPicker,textColor,settextColor } = useContext(ColorContext); // Access the color and functions from context

  return (
    <div className="bg-black text-white flex justify-between p-5">
      <div className="flex gap-5 justify-center items-center">
        <a className="text-3xl" href="/">
          inscribe
        </a>
        <a href="/myNotes">
          My Notes
        </a>
      </div>
      <div className="flex justify-center items-center gap-5">
        {/* <Button text={"🖉"} color={"Black"}  /> */}
        {isPickerOpen && (
          <div className="absolute top-20 right-5 p-3 rounded shadow-lg bg-white">
            <ColorPicker color={textColor} setColor={settextColor} toggleColorPicker={toggleColorPicker} />
          </div>
        )}

        {/* Button to open Color Picker */}
        <Button toggleColorPicker={toggleColorPicker} color={color}  />
        {isPickerOpen && (
          <div className="absolute top-20 right-5 p-3 rounded shadow-lg bg-white">
            <ColorPicker color={color} setColor={setColor} toggleColorPicker={toggleColorPicker} />
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
