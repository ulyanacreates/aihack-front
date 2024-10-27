// InputButton.js
import React, {useState } from 'react';
import RecsList from './RecsList';
import { useNavigate } from 'react-router-dom';

function InputButton() {
  const [inputValue, setInputValue] = useState(''); // State for input value
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Send input data to the backend
      console.log(inputValue)
      const response = await fetch(`http://192.168.10.71:5000/articles/${inputValue}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json(); // Parse the JSON response

      // Navigate to another page based on the response
      navigate('/recslist', { state: { result } }); // Pass the result if needed
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="relative mt-2">
      <form onSubmit={handleSubmit}>
      <input
        value={inputValue} // Set the input value to the state
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="用户想多了解什么呀~"
        aria-label="Email address"
        className="block w-full rounded py-4 pl-6 pr-20 text-base/6 ring-4 ring-transparent transition placeholder:text-black focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5"
        style={{ 
            border: '1px solid var(--dark-mix-04)',
            backgroundColor: 'var(--dark-mix-04)',
            color: 'var(--black)',
            fontFamily: 'Noto Serif SC',
            fontSize: '16px'
        }}
      />
      <div className="absolute inset-y-1 right-1 flex justify-end">
        <button
          type="submit"
          aria-label="Submit"
          className="flex aspect-square h-full items-center justify-center rounded-xl bg-neutral-950 text-white transition hover:bg-neutral-800"
          style={{
            backgroundColor: 'var(--dark-mix)' 
          }}
        >
          <svg viewBox="0 0 16 6" aria-hidden="true" className="w-4">
            <path
              fill="var(--primary-dark)"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16 3 10 .5v2H0v1h10v2L16 3Z"
            ></path>
          </svg>
        </button>
      </div>
      </form>
    </div>
    
  );
}

export default InputButton;