import type { Profile, Post, User } from '../types';

export const mockUser: User = {
  id: 1,
  username: 'alex_morgan',
  email: 'alex.morgan@example.com',
  name: 'Alex Morgan',
  created_at: '2024-01-15T10:00:00Z',
};

export const mockProfile: Profile = {
  id: 1,
  user_id: 1,
  username: 'alex_morgan',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  title: 'Senior Software Engineer',
  location: 'San Francisco, CA',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex_morgan',
  cover_url: '',
  bio: 'Passionate software engineer with 8+ years of experience building scalable web applications. I love turning complex problems into elegant solutions and mentoring junior developers. Currently focused on full-stack development with React and Node.js.',
  phone: '+1 (555) 234-5678',
  website: 'https://alexmorgan.dev',
  linkedin: 'https://linkedin.com/in/alexmorgan',
  github: 'https://github.com/alexmorgan',
  twitter: 'https://twitter.com/alexmorgan',
  skills: [
    'React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL',
    'Docker', 'AWS', 'GraphQL', 'REST APIs', 'System Design',
    'Team Leadership', 'Agile/Scrum',
  ],
  experience: [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      start_date: '2021-03',
      end_date: null,
      current: true,
      description: 'Led development of microservices architecture serving 10M+ users. Mentored a team of 5 junior engineers. Reduced API response time by 40% through caching optimizations.',
    },
    {
      id: 2,
      title: 'Software Engineer',
      company: 'StartupXYZ',
      location: 'New York, NY',
      start_date: '2018-06',
      end_date: '2021-02',
      current: false,
      description: 'Built and maintained React frontend applications. Collaborated with design team to implement pixel-perfect UI components. Developed RESTful APIs using Node.js and Express.',
    },
    {
      id: 3,
      title: 'Junior Developer',
      company: 'WebAgency Co.',
      location: 'Austin, TX',
      start_date: '2016-07',
      end_date: '2018-05',
      current: false,
      description: 'Developed client websites using HTML, CSS, JavaScript and PHP. Managed 15+ client projects simultaneously. Introduced automated testing which reduced bugs by 30%.',
    },
  ],
  education: [
    {
      id: 1,
      school: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      start_date: '2012-09',
      end_date: '2016-05',
      description: 'GPA: 3.8/4.0. Dean\'s List. President of ACM Student Chapter.',
    },
    {
      id: 2,
      school: 'Coursera / Stanford University',
      degree: 'Certificate',
      field: 'Machine Learning',
      start_date: '2020-01',
      end_date: '2020-06',
      description: 'Completed Andrew Ng\'s Machine Learning Specialization with distinction.',
    },
  ],
  connections_count: 847,
  mutual_connections: 23,
  posts_count: 142,
};

export const mockActivity: Post[] = [
  {
    id: 1,
    user_id: 1,
    author_name: 'Alex Morgan',
    author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex_morgan',
    content: 'Excited to share that our team just shipped a major performance improvement that reduced load times by 60%! Proud of what we accomplished together. #engineering #performance',
    created_at: '2024-03-15T14:30:00Z',
    likes: 124,
    comments: [],
    type: 'post',
  },
  {
    id: 2,
    user_id: 1,
    author_name: 'Alex Morgan',
    author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex_morgan',
    content: 'Just published a new article on "Building Resilient Microservices with Node.js". Check it out! The key insight: design for failure from day one. #nodejs #microservices #engineering',
    created_at: '2024-03-10T09:15:00Z',
    likes: 89,
    comments: [],
    type: 'article',
  },
  {
    id: 3,
    user_id: 1,
    author_name: 'Alex Morgan',
    author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex_morgan',
    content: 'Attended AWS re:Invent 2024 last week. Key takeaways: serverless is maturing fast, AI/ML integration is getting easier, and the community is stronger than ever. Happy to share notes with anyone interested!',
    created_at: '2024-03-05T16:45:00Z',
    likes: 67,
    comments: [],
    type: 'post',
  },
  {
    id: 4,
    user_id: 1,
    author_name: 'Alex Morgan',
    author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex_morgan',
    content: 'Completed a 30-day coding challenge focused on system design problems. It\'s amazing how much you can improve with consistent daily practice. Highly recommend it to anyone looking to level up! #100DaysOfCode',
    created_at: '2024-02-28T11:00:00Z',
    likes: 203,
    comments: [],
    type: 'post',
  },
];

export const mockFormValidationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/,
    messages: {
      required: 'Full name is required',
      minLength: 'Name must be at least 2 characters',
      maxLength: 'Name cannot exceed 100 characters',
      pattern: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    },
  },
  username: {
    required: true,
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_]+$/,
    messages: {
      required: 'Username is required',
      minLength: 'Username must be at least 3 characters',
      maxLength: 'Username cannot exceed 30 characters',
      pattern: 'Username can only contain letters, numbers, and underscores',
    },
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    messages: {
      required: 'Email is required',
      pattern: 'Please enter a valid email address',
    },
  },
  bio: {
    maxLength: 500,
    messages: {
      maxLength: 'Bio cannot exceed 500 characters',
    },
  },
  title: {
    maxLength: 100,
    messages: {
      maxLength: 'Title cannot exceed 100 characters',
    },
  },
  location: {
    maxLength: 100,
    messages: {
      maxLength: 'Location cannot exceed 100 characters',
    },
  },
  phone: {
    pattern: /^[+\d\s\-().]*$/,
    messages: {
      pattern: 'Please enter a valid phone number',
    },
  },
  website: {
    pattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    messages: {
      pattern: 'Please enter a valid website URL',
    },
  },
};

export const simulateApiDelay = (ms = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const mockApiResponses = {
  getProfile: async (): Promise<Profile> => {
    await simulateApiDelay();
    return { ...mockProfile };
  },
  updateProfile: async (data: Partial<Profile>): Promise<Profile> => {
    await simulateApiDelay(1000);
    return { ...mockProfile, ...data };
  },
  uploadAvatar: async (_file: File): Promise<{ avatar_url: string }> => {
    await simulateApiDelay(1500);
    return { avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=updated_avatar' };
  },
};
