import React from "react";
import { HexColorPicker } from "react-colorful";
import Button from "./Button";

function ColorPicker({ color, setColor, toggleColorPicker }) {
  
  // Function to update the color
  const setColorValue = (newColor) => {
    setColor(newColor); // Update the color using the prop
    // console.log(color)
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Color Picker */}
      <HexColorPicker color={color} onChange={setColorValue} />

      {/* Close Button */}
      <Button toggleColorPicker={toggleColorPicker} text="X" color="black" />
    </div>
  );
}

export default ColorPicker;
