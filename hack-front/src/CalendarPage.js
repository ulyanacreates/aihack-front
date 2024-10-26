import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import React, { useEffect } from 'react';
import Calendar from '@toast-ui/calendar';

function CalendarPage() {
  useEffect(() => {
    const calendar = new Calendar('#calendar', {
      defaultView: 'month', // You can set 'week' or 'day' as default view
      useCreationPopup: true,
      useDetailPopup: true,
      calendars: [
        {
          id: '1',
          name: 'Personal',
          color: '#ffffff',
          bgColor: '#9e5fff',
          dragBgColor: '#9e5fff',
          borderColor: '#9e5fff',
        },
        {
          id: '2',
          name: 'Work',
          color: '#ffffff',
          bgColor: '#00a9ff',
          dragBgColor: '#00a9ff',
          borderColor: '#00a9ff',
        },
      ],
      // Additional options can be added here
    });

    // Clean up the calendar instance when the component unmounts
    return () => {
      calendar.destroy();
    };
  }, []);

  return (
    <div id="calendar" style={{ height: '800px' }}></div>
  );
}

export default CalendarPage;