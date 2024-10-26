import React, { useEffect, useState } from 'react'
import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CalendarPage from './CalendarPage';
import CategoryList from './CategoryList';
import InputButton from './InputButton';

function App() {
  const [data, setData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // State for loading status

  const mockData = {
    isNewUser: true, // Change this to false to test the other scenario
  };

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch('https://your-backend-api.com/data'); // Replace with your backend URL
        // const result = await response.json();
        // setData(result); // Set the fetched data to state
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setData(mockData); // Set the mock data to state
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, []);

  // Conditional rendering based on the fetched data
  // if (loading) {
  //   return <p>Loading...</p>; // Show loading text while fetching data
  // }
  return (
    <Router>
      <div>
        {/* Navigation Menu */}
        <nav className="p-2 pl-8">
          <ul className="flex items-center">
            <div className='items-center'>
                  <h1 className="h1">项目名字</h1>
            </div>
            <li>
              <Link to="/" className="link_text">
                主页
              </Link>
            </li>
            <li>
              <Link to="/calendar" className="link_text">
                日历
              </Link>
            </li>
            <li>
              <Link to="/category" className="link_text">
                消息分类
              </Link>
            </li>
          </ul>
        </nav>

        {/* Route Definitions */}
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex items-start justify-start h-screen p-6">
                {/* <div className='items-start justify-start h-screen'>
                  <h1 className="h1">项目名字</h1>
                </div> */}

                <div className='items-start justify-start hscreen'>
                  <h2 className="h2 pt-44 pl-40 pb-2">
                    {data?.isNewUser? "产品介绍" : "今日总结"}
                    </h2>
                  <text className='text pt-52 pl-40'>
                    {data?.isNewUser? "简单描述我们的产品" : "简单描述今天的总结"}
                  </text>
                  <div className='pl-40'>
                    <InputButton />
                  </div>
                </div>

                <div className='items-start justify-start h-screen'>

                </div>
              </div>
            }
          />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/category" element={<CategoryList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
