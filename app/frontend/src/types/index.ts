export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  created_at?: string;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  location?: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description?: string;
}

export interface Education {
  id: number;
  school: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string | null;
  description?: string;
}

export interface Profile {
  id: number;
  user_id: number;
  username: string;
  name: string;
  email: string;
  title?: string;
  location?: string;
  avatar_url?: string;
  cover_url?: string;
  bio?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  connections_count?: number;
  mutual_connections?: number;
  posts_count?: number;
}

export interface Comment {
  id: number;
  user_id: number;
  content: string;
  created_at: string;
}

export interface Post {
  id: number;
  user_id: number;
  author_name?: string;
  author_avatar?: string;
  content: string;
  created_at: string;
  likes: number;
  comments: Comment[];
  type?: 'post' | 'article' | 'activity';
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  created_at: string;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  read: boolean;
}

export interface ProfileFormData {
  name: string;
  username: string;
  email: string;
  title: string;
  location: string;
  bio: string;
  phone: string;
  website: string;
  linkedin: string;
  github: string;
  twitter: string;
  skills: string[];
  experience: Omit<Experience, 'id'>[];
  education: Omit<Education, 'id'>[];
}

export interface ValidationErrors {
  [key: string]: string;
}
