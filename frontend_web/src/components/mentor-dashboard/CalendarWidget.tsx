import React from 'react';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
import { CalendarEvent } from './types';
import { FaCalendarAlt, FaClock, FaUsers } from 'react-icons/fa';

const CalendarWidget: React.FC = () => {
  // const { data: events, isLoading, error } = useQuery<CalendarEvent[]>({
  //   queryKey: ['calendarEvents'],
  //   queryFn: async () => {
  //     const response = await axios.get('/api/v1/mentor/calendar-events');
  //     return response.data;
  //   },
  // });

  // Define events as an empty array
  const events: CalendarEvent[] = [];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'session':
        return <FaUsers className="w-4 h-4" />;
      case 'meeting':
        return <FaCalendarAlt className="w-4 h-4" />;
      default:
        return <FaClock className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'session':
        return 'bg-blue-100 text-blue-800';
      case 'meeting':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
      <div className="space-y-4">
        {events?.map((event: CalendarEvent) => (
          <div
            key={event.id}
            className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className={`p-2 rounded-full ${getEventColor(event.type)}`}>
              {getEventIcon(event.type)}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
              <p className="text-xs text-gray-500">
                {new Date(event.date).toLocaleString()}
              </p>
              {event.description && (
                <p className="text-xs text-gray-600 mt-1">{event.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWidget; 