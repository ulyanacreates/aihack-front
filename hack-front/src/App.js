import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CategoryList from './CategoryList';
import CalendarPage from './CalendarPage';
import './App.css';

function Home() {
  return (
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
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">主页</Link>
            </li>
            <li>
              <Link to="/categories">分类列表</Link>
            </li>
            <li>
              <Link to="/calendar">日历</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
