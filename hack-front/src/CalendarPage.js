import React, { useEffect } from 'react';
import Calendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';

function CalendarPage() {
  useEffect(() => {
    const calendar = new Calendar('#calendar', {
      defaultView: 'month',
      useCreationPopup: false,
      useDetailPopup: true, // Enables the detail popup for events
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
      template: {
        // Customize how the time and title appear in the calendar
        time: (event) => {
          const { start, end, title } = event;
          return `<span>${start.getHours()}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours()}:${end.getMinutes().toString().padStart(2, '0')} ${title}</span>`;
        },
        // Customize the detail popup to display location separately
        popupDetailBody: (event) => {
          return `
            <p>${event.title}</p>
            <p><strong>Location:</strong> ${event.location}</p>
          `;
        },
      },
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
        location: activity.location, // Store location for detail popup
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