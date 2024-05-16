import { useState } from 'react';

const Button = ({ buttonText, loadingText, successText }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClick = () => {
    // Simulate loading process
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000); 
    }, 10000); 
  };

  return (
    <button
    onClick={handleClick}
    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded flex items-center justify-center ${
        loading ? 'opacity-50 cursor-wait' : ''
      } mx-auto my-auto`}
      disabled={loading}
  >
    {loading ? (
      <svg
        className="animate-spin h-8 w-8 text-white mr-3"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V2.5M20 12a8 8 0 01-8 8V21.5"
        ></path>
      </svg>
    ) : (
      <span className="flex items-center">
        <span>{success ? successText : buttonText}</span>
      </span>
    )}
  </button>
  );
};

export default Button;

