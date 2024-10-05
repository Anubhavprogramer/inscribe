import React, { useContext } from 'react'
import { ColorContext } from '../Contexts/ColorContext';

function TextEditor() {
    const {color,textColor} = useContext(ColorContext);
  return (
    <div style={{backgroundColor: color, color:textColor}} className='h-screen '>TextEditor</div>
  )
}

export default TextEditor