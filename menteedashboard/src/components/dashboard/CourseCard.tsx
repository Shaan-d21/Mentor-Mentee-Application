import React from 'react';
import { BookOpenIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';

interface CourseCardProps {
  title: string;
  icon: string;
  lessons: number;
  files: number;
  students: number;
  bgColor: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  icon,
  lessons,
  files,
  students,
  bgColor,
}) => {
  return (
    <div className={`${bgColor} rounded-2xl p-6 hover:shadow-sm transition-shadow duration-200 cursor-pointer group min-h-[180px] flex flex-col`}>
      <div className="text-4xl mb-5">{icon}</div>
      <h3 className="font-semibold mb-6 text-[#1C1C1C] group-hover:text-[#1C1C1C]/90 line-clamp-2">{title}</h3>
      
      <div className="flex items-center justify-between text-sm text-gray-600 mt-auto">
        <div className="flex items-center gap-2">
          <BookOpenIcon className="w-4 h-4" />
          <span>{lessons}</span>
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4" />
          <span>{files}</span>
        </div>
        <div className="flex items-center gap-2">
          <UserIcon className="w-4 h-4" />
          <span>{students}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;