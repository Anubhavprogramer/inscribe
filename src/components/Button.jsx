import React, { useContext } from 'react';
import { ColorContext } from '../Contexts/ColorContext';

const Button = ({ toggleColorPicker,text, color }) => { // Destructure toggleColorPicker from props
    // console.log(text);
    // const {color} = useContext(ColorContext);
  return (
    <button 
      style={{ backgroundColor: color }} // Correct the style
      onClick={toggleColorPicker} // Correct the click handler
      className="relative block w-7 h-7 rounded-full m-0 bg-white overflow-hidden outline-none cursor-pointer border-0"
    >
       {text} 
    </button>
  );
};

export default Button;
