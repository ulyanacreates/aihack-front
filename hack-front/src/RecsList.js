// RecsList.js
import React, { useEffect, useState } from 'react';
import InputButton from './InputButton';

function RecsList() {
    // const [recs, setData] = useState(null); // State to store fetched data
    // const [error, setError] = useState(null); // State for error handling
    const recs = [
              { id: 1, title: "新的AI效率工具", category: "AI, 效率工具", summary: ["啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊"], date: "2023-04-15", priority: "高" },
              { id: 2, title: "新的AI效率工具2", category: "AI, 效率工具", summary: ["啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊2"], date: "2023-04-15", priority: "低"},
              { id: 3, title: "新的AI效率工具3", category: "AI, 效率工具", summary: ["啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊3"], date: "2023-04-15", priority: "低"},
              { id: 4, title: "新的AI效率工具4", category: "AI, 效率工具", summary: ["啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊4"], date: "2023-04-15", priority: "低"}
              // ... 更多模拟数据
            ];
    // useEffect(()=>{
    //     const fetchData = async () => {
    //         console.log('Fetching data...'); // Log before fetching
    //         try {
    //           const response = await fetch('http://172.20.10.4:5000/articles/random/3', {
    //             method: 'GET', // Explicitly specifying the method
    //           });
    //           if (!response.ok) {
    //             throw new Error('Network response was not ok'); // Handle HTTP errors
    //           }
    //           const recs = await response.json();
    //           console.log('the recs values are:', recs);
    //           setData(recs); // Set the fetched data to state
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //       };
    //       fetchData();
    //     }, []);
  return (
    <div>
    <div className="flex items-start justify-start h-screen p-6">
        <div className='items-start justify-start hscreen'>
            <h2 className="h2 pt-32 pl-36 pb-2">今日总结</h2>
            <text className='text pt-52 pl-36'>简单描述今天的总结</text>
            <div className='pl-36 max-w-md'>
                <InputButton />
            </div>
            <div className="category-grid pt-8 pl-36 grid grid-cols-1 md:grid-cols-4 gap-8">
              <ul>
                {recs?.map((item) => (
                    <div
                        class="h-[16em] w-[18em] border-2 border-[rgba(75,30,133,0.5)] rounded-[1.5em] bg-gradient-to-br from-[var(--primary-dark-04)] to-[var(--primary-dark-04)] text-white font-nunito p-[1em] flex justify-center items-left flex-col gap-[0.75em] backdrop-blur-[12px]"
                        style={{
                            borderColor: 'var(--dark-mix-04)'
                        }}
                    >
                        <div className='pb-36'>
                            <h1 class="h1" style={{ color: 'var(--primary-dark)'}}>{item.title}</h1>
                            <p className="wtext mt-2">
                                {item.summary}
                            </p>
                        </div>
                    </div>
                    ))}
              </ul>
            </div>
        </div>
    </div>
    </div>
  )
}

export default RecsList