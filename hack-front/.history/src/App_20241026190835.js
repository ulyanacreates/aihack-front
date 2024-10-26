import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    // 模拟从后端获取数据
    const fetchData = async () => {
      // 这里应该是实际的API调用
      const mockData = [
        { id: 1, title: "信息1", category: "分类1", subTags: ["兴趣1", "兴趣2", "兴趣3"], date: "2023-04-15", priority: "高" },
        // ... 更多模拟数据
      ];
      setData(mockData);
    };
    fetchData();
  }, []);

  const categories = ["分类1", "分类2", "分类3", "分类4", "分类5"];

  // ... 前面的代码保持不变 ...

const renderHomePage = () => (
  <div className="home-page">
    <h1>信息分类展示</h1>
    <div className="category-grid">
      {categories.map((category, index) => (
        <div
          key={category}
          className="category-card"
          onClick={() => setSelectedCategory(category)}
          style={{
            background: `linear-gradient(135deg, #1e3a8a ${index * 5}%, #1e40af ${100 - index * 5}%)`
          }}
        >
          <h2>{category}</h2>
          <ul>
            {data.filter(item => item.category === category).slice(0, 3).map(item => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

// ... 后面的代码保持不变 ...
  const renderCategoryPage = () => (
    <div className="category-page">
      <h1>{selectedCategory}</h1>
      <button onClick={() => setSelectedCategory(null)}>返回首页</button>
      <div className="info-list">
        {data.filter(item => item.category === selectedCategory).map(item => (
          <div key={item.id} className="info-card">
            <h3>{item.title}</h3>
            <div className="info-details">
              <span className="info-icon">📄</span>
              <span className="info-tags">{item.subTags.join(", ")}</span>
              <span className="info-date">{item.date}</span>
              <span className="info-priority">{item.priority}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="App">
      {selectedCategory ? renderCategoryPage() : renderHomePage()}
    </div>
  );
}

export default App;