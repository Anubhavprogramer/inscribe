import { useContext } from "react";
import { ColorContext } from "../Contexts/ColorContext";
import PropTypes from 'prop-types';

function Button({ toggleColorPicker, text, color }) {
  const { setColor } = useContext(ColorContext);

  const handleClick = () => {
    if (toggleColorPicker) {
      toggleColorPicker();
    } else if (color) {
      setColor(color);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-10 h-10 rounded-full border-2 border-white"
      style={{ backgroundColor: color || "#ffffff" }}
    >
      {text}
    </button>
  );
}

Button.propTypes = {
  toggleColorPicker: PropTypes.func,
  text: PropTypes.string,
  color: PropTypes.string,
};

export default Button;
