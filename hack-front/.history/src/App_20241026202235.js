import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CategoryList from './CategoryList';
import './App.css';

function Home() {
  return (
    <div>
      <h1>欢迎来到主页</h1>
      <Link to="/categories">查看分类列表</Link>
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
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<CategoryList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
