// RecsList.js
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import InputButton from './InputButton';

const ITEMS_PER_LOAD = 3; // Number of items to load each time

function RecsList() {
    const location = useLocation(); // Use location to access the navigation state
    const [recs, setRecs] = useState([]); // State to store fetched data
    // const [error, setError] = useState(null); // State for error handling
    const [displayedRecs, setDisplayedRecs] = useState([]); // State to store displayed data
    const [isUserNew, setIsUserNew] = useState(false);
    // const recs = [
    //           { id: 1, title: "新的AI效率工具", category: "AI, 效率工具", summary: ["啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊"], date: "2023-04-15", priority: "高" },
    //           { id: 2, title: "新的AI效率工具2", category: "AI, 效率工具", summary: ["啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊2"], date: "2023-04-15", priority: "低"},
    //           { id: 3, title: "新的AI效率工具3", category: "AI, 效率工具", summary: ["啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊3"], date: "2023-04-15", priority: "低"},
    //           { id: 4, title: "新的AI效率工具4", category: "AI, 效率工具", summary: ["啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊4"], date: "2023-04-15", priority: "低"}
    //           // ... 更多模拟数据
    //         ];
    useEffect(()=>{
        const fetchData = async () => {
            console.log('Fetching data...'); // Log before fetching
            try {
              const response = await fetch('http://192.168.10.71:5000/articles/random/6', {
                method: 'GET', // Explicitly specifying the method
              });
              if (!response.ok) {
                throw new Error('Network response was not ok'); // Handle HTTP errors
              }
              const data = await response.json();
              console.log('the data is: ', data)
              if (data && Array.isArray(data.articles)) {
                setRecs(data.articles); // Set articles to recs
                setIsUserNew(data.isUserNew || false); // Optionally set isUserNew
                setDisplayedRecs(data.articles.slice(0, ITEMS_PER_LOAD)); // Load initial items
              } else {
                console.error('Articles are not in the expected format:', data);
              }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
          };
          // Check if there's state passed from InputButton
        if (location.state && location.state.result) {
            const result = location.state.result;
            console.log('Received result:', result);
            if (result.articles && Array.isArray(result.articles)) {
                setRecs(result.articles);
                setIsUserNew(result.isUserNew || false);
                setDisplayedRecs(result.articles.slice(0, ITEMS_PER_LOAD));
            } else {
                console.error('Received result is not in the expected format:', result);
                fetchData(); // Fallback to fetching data if result is not valid
            }
        } else {
            fetchData(); // Fetch data if no state is passed
        }
        }, [location.state]);

    const loadMoreItems = useCallback(() => {
        if (!recs || displayedRecs.length >= recs.length) {
            return; // Exit if recs is null or if there are no more items to load
        }
        setDisplayedRecs((prev) => [
            ...prev,
            ...recs.slice(prev.length, prev.length + ITEMS_PER_LOAD),
        ]);
      }, [displayedRecs.length, recs]);
      

    // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      // Check if we're near the bottom of the page
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        loadMoreItems();
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Load the first set of items
    loadMoreItems();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMoreItems]);
  return (
    <div>
    <div className="flex items-start justify-start h-screen p-6 pl-36">
        <div className='items-start justify-start hscreen'>
        <h2 className="h2 pt-16 pb-2 pl-4">
            {isUserNew ? "产品介绍" : "今日总结"} 
        </h2>
            <text className='text pt-20 pl-4'>
                {isUserNew ? "不怕拖延症，稍后再看也不忘" : "简单描述今天的总结"}
            </text>
            <div className='pl-4 max-w-xl'>
                <InputButton />
            </div>
            <div className="category-grid pt-4 grid grid-cols-1 md:grid-cols-3 gap-8">
              
                {displayedRecs.map((item) => (
                    <ul>
                    <div
                        key={item.id}
                        className="h-[12em] w-full max-w-[25em] border-2 border-[rgba(75,30,133,0.5)] rounded-[1.5em] bg-gradient-to-br from-[var(--primary-dark-04)] to-[var(--primary-dark-04)] text-white font-nunito p-[1em] flex flex-col justify-start gap-[0.75em] backdrop-blur-[12px]"
                        style={{
                            borderColor: 'var(--dark-mix-04)'
                        }}
                    >
                        <div className=''>
                            <h1 className="h3" style={{ color: 'var(--primary-dark)', fontSize: '22px'}}>{item.title}</h1>
                            <p className="wtext mt-0.5">
                                {item.date}
                            </p>
                            <p className="labeltext text-white" style={{ fontSize: '16px', fontWeight: 'bold'}} >
                                {item.labels.join(', ')}
                            </p>
                        </div>
                    </div>
                    </ul>
                    ))}
            </div>
        </div>
    </div>
    </div>
  )
}

export default RecsList