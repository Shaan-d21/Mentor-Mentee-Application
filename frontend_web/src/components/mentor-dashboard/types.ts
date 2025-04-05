export interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
  totalStudents: number;
  status: 'active' | 'completed' | 'upcoming';
}

export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  type: 'session' | 'meeting' | 'deadline';
  description?: string;
}

export interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface HoursSpentData {
  date: string;
  hours: number;
  type: 'teaching' | 'planning' | 'mentoring';
}

export interface Assignment {
  id: number;
  title: string;
  courseId: number;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  submissions: number;
}

export interface Document {
  id: number;
  title: string;
  type: 'pdf' | 'doc' | 'video';
  uploadDate: string;
  size: string;
  courseId?: number;
}

export interface Message {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
}

export interface DashboardStats {
  totalStudents: number;
  activeCourses: number;
  pendingAssignments: number;
  upcomingSessions: number;
  totalHoursSpent: number;
} 