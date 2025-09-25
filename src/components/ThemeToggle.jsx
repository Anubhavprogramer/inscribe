import { useContext } from 'react';
import { ColorContext } from '../Contexts/ColorContext';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useContext(ColorContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-800 dark:text-gray-200"
      aria-label="Toggle theme"
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <MdLightMode className="w-5 h-5" />
      ) : (
        <MdDarkMode className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;