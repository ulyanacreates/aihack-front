import React, { useEffect } from 'react';
import Calendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';

function CalendarPage() {
  useEffect(() => {
    const calendar = new Calendar('#calendar', {
      defaultView: 'month',
      useCreationPopup: false,
      useDetailPopup: false,
      calendars: [
        {
          id: '1',
          name: 'Events',
          color: '#ffffff',
          bgColor: '#9e5fff',
          dragBgColor: '#9e5fff',
          borderColor: '#9e5fff',
        },
      ],
    });

    const fetchEvents = async () => {
      const response = await fetch('http://192.168.10.71:5000/activities');
      const data = await response.json();

      // Transform the fetched data into the format required by the calendar
      const events = data.activities.map(activity => ({
        id: String(activity.id),
        calendarId: '1', // Use the corresponding calendar ID
        title: activity.title,
        category: 'time', // or 'allday' based on your needs
        start: new Date(activity.date).toISOString(), // Convert to ISO string for start time
        end: new Date(new Date(activity.date).getTime() + 60 * 60 * 1000).toISOString(), // Example: 1 hour duration
        location: activity.location, // Optional: Store location if needed
        organizer: activity.organizer, // Optional: Store organizer if needed
        link: activity.link, // Optional: Store link if needed
      }));

      // Load events into the calendar
      calendar.createEvents(events);
    };

    fetchEvents();

    return () => {
      calendar.destroy();
    };
  }, []);

  return (
    <div id="calendar" style={{ height: '800px' }}></div>
  );
}

export default CalendarPage;