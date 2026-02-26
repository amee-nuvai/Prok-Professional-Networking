import { createBrowserRouter, Outlet } from 'react-router-dom';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import ProfileView from '../components/profile/ProfileView';
import ProfileEdit from '../components/profile/ProfileEdit';
import PostCreate from '../components/posts/PostCreate';
import PostList from '../components/posts/PostList';
import Feed from '../components/feed/Feed';
import JobList from '../components/job-board/JobList';
import MessageList from '../components/messaging/MessageList';
import Navbar from '../components/navigation/Navbar';

const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: '/profile',
        element: <ProfileView />,
      },
      {
        path: '/profile/edit',
        element: <ProfileEdit />,
      },
      {
        path: '/posts/create',
        element: <PostCreate />,
      },
      {
        path: '/posts',
        element: <PostList />,
      },
      {
        path: '/feed',
        element: <Feed />,
      },
      {
        path: '/jobs',
        element: <JobList />,
      },
      {
        path: '/messages',
        element: <MessageList />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300">404</h1>
          <p className="text-gray-500 mt-2">Page not found</p>
          <a href="/" className="mt-4 inline-block text-blue-600 hover:underline text-sm">
            Go home
          </a>
        </div>
      </div>
    ),
  },
]);
