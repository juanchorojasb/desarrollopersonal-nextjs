// types/courses.ts
export interface VideoSession {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  duration?: string;
  materials?: Material[];
  activities?: Activity[];
  order: number;
}

export interface Material {
  id: string;
  title: string;
  type: 'pdf' | 'document' | 'link' | 'worksheet' | 'audio';
  url?: string;
  description?: string;
  downloadable?: boolean;
}

export interface Activity {
  id: string;
  title: string;
  type: 'reflection' | 'exercise' | 'quiz' | 'journal' | 'practice';
  description: string;
  instructions?: string[];
  completed?: boolean;
  points?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  totalSessions: number;
  totalDuration: string;
  sessions: VideoSession[];
  objectives: string[];
  requirements?: string[];
  tags: string[];
  instructor: string;
  certificateAvailable: boolean;
}

export interface UserProgress {
  courseId: string;
  completedSessions: string[];
  completedActivities: string[];
  lastAccessed: Date;
  progress: number; // percentage 0-100
}
