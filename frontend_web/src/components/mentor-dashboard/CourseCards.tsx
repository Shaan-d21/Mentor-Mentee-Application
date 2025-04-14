import React from 'react';
// import { useQuery } from '@tanstack/react-query';
import { Course } from './types';
import { FaUsers, FaClock } from 'react-icons/fa';

const CourseCards: React.FC = () => {
  // Define courses as an empty array
  const courses: Course[] = [];

  return (
    <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses?.map((course: Course) => (
        <div key={course.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${
              course.status === 'active' ? 'bg-green-100 text-green-800' :
              course.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {course.status}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">{course.description}</p>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <FaUsers className="mr-2" />
              <span>{course.totalStudents} students</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <FaClock className="mr-2" />
              <span>Progress: {course.progress}%</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseCards; 