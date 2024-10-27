import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './CategoryDetail.css';

const CategoryDetail = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  
  const params = useParams();
  console.log('Params:', params);
  const { categoryName } = params;
  console.log('Category:', categoryName);

  const location = useLocation();
  console.log('Current path:', location.pathname);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      if (!categoryName) {
        setError('No category specified');
        setIsLoading(false);
        return;
      }
      try {
        const apiUrl = `http://192.168.10.71:5000/articles/${categoryName}`;
        
        // 打印 URL 以进行调试
        console.log('Fetching articles from URL:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        console.log('API Response:', data);
        
        const formattedData = formatApiData(data);
        setArticles(formattedData);
      } catch (e) {
        console.error('Error fetching articles:', e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [categoryName]);

  const formatApiData = (apiData) => {
    if (!apiData || !Array.isArray(apiData.articles)) {
      console.error('API data does not contain an articles array:', apiData);
      return [];
    }

    return apiData.articles.map(article => ({
      id: article.id,
      title: article.title,
      date: article.date,
      priority: article.priority,
      publisher: article.publisher,
      text: article.text,
      link: article.link,
      labels: article.labels || [],
      isFavorite: false // 添加默认的收藏状态
    }));
  };

  if (isLoading) return <div className="category-detail-loading">Loading articles...</div>;
  if (error) return <div className="category-detail-error">Error loading articles: {error}</div>;

  const toggleFavorite = (id) => {
    setArticles(articles.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const deleteItem = (id) => {
    setArticles(articles.filter(item => item.id !== id));
  };

  const filteredData = articles.filter(item =>
    (showFavorites ? item.isFavorite : true) &&
    (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.labels.some(label => label.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const priorityColors = {
    High: '#ff4d4d',
    Medium: '#ffa64d',
    Low: '#4da6ff'
  };

  return (
    <div className="category-detail-container">
      <div className="category-header">
        <h1 className="category-detail-title">{categoryName}</h1>
        <div className="category-controls">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="category-detail-search"
          />
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className="category-detail-favorite-toggle"
          >
            {showFavorites ? 'Show All' : 'Show Favorites'}
          </button>
        </div>
      </div>
      <div className="category-detail-list">
        {filteredData.map(item => (
          <div key={item.id} className="detail-info-card">
            <div className="info-content">
              <a href={item.link} className="info-title" target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
              <div className="info-tags">
                {item.labels.map((label, index) => (
                  <span key={index} className="info-tag">{label}</span>
                ))}
              </div>
              <span className="info-date">{item.date}</span>
            </div>
            <div className="info-actions">
              <button onClick={() => toggleFavorite(item.id)} className={`favorite-btn ${item.isFavorite ? 'active' : ''}`}>
                {item.isFavorite ? '★' : '☆'}
              </button>
              <button onClick={() => deleteItem(item.id)} className="delete-btn">
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryDetail;
