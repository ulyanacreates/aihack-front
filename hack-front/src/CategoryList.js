import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CategoryList.css';

const CategoryList = () => {
  const [categories, setCategories] = useState([
    { key: "电子信息", name: "电子信息", color: "rgba(255, 249, 196, 0.5)" },
    { key: "就业资讯", name: "就业资讯", color: "rgba(200, 230, 201, 0.5)" },
    { key: "科研论文", name: "科研论文", color: "rgba(255, 224, 178, 0.5)" },
    { key: "时政新闻", name: "时政新闻", color: "rgba(225, 190, 231, 0.5)" },
    { key: "家人的爱", name: "家人的爱", color: "rgba(245, 245, 245, 0.5)" },
    { key: "所有", name: "所有", color: "rgba(187, 222, 251, 0.7)" }
  ]);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const USE_MOCK_DATA = false; // 设置为 true 使用模拟数据，false 使用 API

  const formatApiData = (apiData) => {
    if (!apiData || !Array.isArray(apiData.articles)) {
      console.error('API data does not contain an articles array:', apiData);
      return [];
    }

    return apiData.articles.map(article => ({
      id: article.id,
      title: article.title,
      category: article.category,
      subTags: article.labels || [],
      date: article.date,
      priority: article.priority,
      publisher: article.publisher,
      text: article.text,
      link: article.link  // 确保包含 link
    }));
  };

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        if (USE_MOCK_DATA) {
          // 使用模拟数据
          const mockData = [
            { id: 1, title: "信息1", category: "电子信息", subTags: ["兴趣1", "兴趣2", "兴趣3"], date: "2023-04-15", priority: "高" },
            { id: 2, title: "信息2", category: "就业资讯", subTags: ["兴趣2", "兴趣3"], date: "2023-04-16", priority: "中" },
            // ... 更多模拟数据
          ];
          setArticles(mockData);
        } else {
          // 使用实际 API
          const response = await fetch('http://192.168.10.71:5000/articles');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const apiData = await response.json();
          console.log('Raw API response:', apiData); // 用于调试
          const formattedData = formatApiData(apiData);
          setArticles(formattedData);
        }
      } catch (e) {
        console.error('Error fetching articles:', e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (isLoading) return <div>Loading articles...</div>;
  if (error) return <div>Error loading articles: {error}</div>;

  const renderInfoCard = (item) => (
    <div key={item.id} className="list-info-card">
      <a href={item.link} className="list-info-title" target="_blank" rel="noopener noreferrer">
        {item.title}
      </a>
      <div className="info-subtags-date">
        <span className="info-subtags">{item.subTags.join(', ')}</span>
        <span className="info-date">{item.date}</span>
      </div>
    </div>
  );

  const renderHomePage = () => (
    <div className="category-grid">
      {categories.map(category => (
        <div 
          key={category.key} 
          className={`category-card category-${category.key}`}
          style={{ backgroundColor: category.color }}
        >
          <h2 className="category-title">{category.name}</h2>
          <div className="info-list">
            {articles
              .filter(article => article.category === category.name || category.key === '所有')
              .slice(0, 4)
              .map(article => (
                <div key={article.id} className="list-info-card">
                  <a 
                    href={article.link} 
                    className="list-info-title" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {article.title}
                  </a>
                  <div className="info-subtags-date">
                    <span className="info-subtags">{article.subTags.join(', ')}</span>
                    <span className="info-date">{article.date}</span>
                  </div>
                </div>
              ))}
          </div>
          <Link to={`/category/${category.key}`} className="view-more">
            查看更多
          </Link>
        </div>
      ))}
    </div>
  );

  return (
    <div className="App flex flex-col min-h-screen">
      <div className="flex-grow p-6">
        {renderHomePage()}
      </div>
    </div>
  );
};

export default CategoryList;
