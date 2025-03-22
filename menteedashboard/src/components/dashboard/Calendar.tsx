import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Calendar = () => {
  const days = [
    { label: 'M', id: 'mon' },
    { label: 'T', id: 'tue' },
    { label: 'W', id: 'wed' },
    { label: 'T', id: 'thu' },
    { label: 'F', id: 'fri' },
    { label: 'S', id: 'sat' },
    { label: 'S', id: 'sun' },
  ];
  const currentDate = new Date();
  
  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold">March 2025</h3>
        <div className="flex gap-4">
          <button className="text-gray-600 hover:text-dark">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button className="text-gray-600 hover:text-dark">
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day) => (
          <div key={day.id} className="text-center text-sm text-gray-500">
            {day.label}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }, (_, i) => {
          const day = i - 3; // Adjust starting day
          const isToday = day === currentDate.getDate();
          const isSelected = day === 25;
          
          return (
            <button
              key={`day-${i}`}
              className={`
                h-8 flex items-center justify-center text-sm rounded-full
                ${day < 1 || day > 31 ? 'invisible' : ''}
                ${isToday ? 'bg-dark text-white' : ''}
                ${isSelected ? 'bg-teal-500 text-white' : ''}
                ${!isToday && !isSelected ? 'hover:bg-gray-100' : ''}
              `}
            >
              {day > 0 && day <= 31 ? day : ''}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;