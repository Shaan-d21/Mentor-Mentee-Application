export interface Mentee {
  id: number;
  name: string;
  email: string;
  domain: string[];
  status: 'in_progress' | 'completed' | 'pending';
  progress: number;
  comments?: string;
}

export interface MentorProfile {
  id: number;
  name: string;
  email: string;
  experience: number;
  githubId: string;
  profile_pic_url?: string;
  contact: string;
  skills: Array<{
    name: string;
    proficiency: number;
  }>;
}

export interface DashboardStats {
  totalMentees: number;
  activeMentees: number;
  completedMentees: number;
  pendingRequests: number;
}

export interface MenteeRequest {
  id: number;
  menteeId: number;
  menteeName: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  domain: string[];
} 