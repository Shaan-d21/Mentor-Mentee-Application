import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Course } from './types';
import { FaUsers, FaClock, FaCheckCircle } from 'react-icons/fa';

const CourseCards: React.FC = () => {
  const { data: courses, isLoading, error } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/mentor/courses');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="col-span-3 bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-3 bg-white rounded-lg shadow p-6">
        <div className="text-red-500">Error loading courses</div>
      </div>
    );
  }

  return (
    <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses?.map((course) => (
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