import React, { useEffect, useState } from 'react'
import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CalendarPage from './CalendarPage';

function App() {
  const [data, setData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // State for loading status

  // Fetch data from the backend when the component mounts
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('https://your-backend-api.com/data'); // Replace with your backend URL
  //       const result = await response.json();
  //       setData(result); // Set the fetched data to state
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     } finally {
  //       setLoading(false); // Set loading to false after fetching
  //     }
  //   };

  //   fetchData();
  // }, []);

  // // Conditional rendering based on the fetched data
  // if (loading) {
  //   return <p>Loading...</p>; // Show loading text while fetching data
  // }
  return (
    <Router>
      <div>
        {/* Navigation Menu */}
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/calendar">Calendar</Link>
            </li>
          </ul>
        </nav>

        {/* Route Definitions */}
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex items-start justify-start h-screen p-6">
                <div className='items-start justify-start h-screen'>
                  <h1 className="h1">项目名字</h1>
                </div>

                <div className='items-start justify-start hscreen'>
                  <h2 className="h2 pt-44 pl-40 pb-2">今日总结</h2>
                  <text className='text pt-52 pl-40'>简单描述今天的总结</text>
                </div>

                <div className='items-start justify-start h-screen'>

                </div>
              </div>
            }
          />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>

        {/* <div className="flex items-start justify-start h-screen p-6">
          <div className='items-start justify-start h-screen'>
            <h1 className="h1">项目名字</h1>
          </div>

          <div className='items-start justify-start hscreen'>
            <h2 className="h2 pt-44 pl-40 pb-2">今日总结</h2>
            <text className='text pt-52 pl-40'>简单描述今天的总结</text>
          </div>

          <div className='items-start justify-start h-screen'>

          </div>
        </div> */}
      </div>
    </Router>
  );
}

export default App;
