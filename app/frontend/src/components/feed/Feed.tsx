import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Feed: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">
        Welcome {user?.username}
      </h1>

      <div className="space-y-6">
        {/* Feed content */}
      </div>
    </div>
  );
};

export default Feed;