import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { profileApi } from './api';
import { mockActivity } from '../../data/mockData';
import type { Profile, Post } from '../../types';

// ─── Profile Header ────────────────────────────────────────────────────────────

interface ProfileHeaderProps {
  profile: Profile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    {/* Cover photo */}
    <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 relative">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
    </div>

    <div className="px-4 sm:px-6 pb-6">
      {/* Avatar + name row */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 sm:-mt-16">
        <div className="flex items-end space-x-4">
          <div className="relative">
            <img
              src={
                profile.avatar_url ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`
              }
              alt={profile.name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md bg-gray-100 object-cover"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
          </div>
          <div className="pb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{profile.name}</h1>
            {profile.title && (
              <p className="text-sm sm:text-base text-gray-600">{profile.title}</p>
            )}
            {profile.username && (
              <p className="text-xs text-gray-400">@{profile.username}</p>
            )}
          </div>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/profile/edit"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Location & connections */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
        {profile.location && (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {profile.location}
          </span>
        )}
        {profile.connections_count !== undefined && (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="font-medium text-gray-900">
              {profile.connections_count.toLocaleString()}
            </span>{' '}
            connections
          </span>
        )}
        {profile.mutual_connections !== undefined && profile.mutual_connections > 0 && (
          <span className="text-blue-600 font-medium">
            {profile.mutual_connections} mutual connections
          </span>
        )}
      </div>

      {/* Social links */}
      <div className="mt-4 flex flex-wrap gap-3">
        {profile.website && (
          <a
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            Website
          </a>
        )}
        {profile.linkedin && (
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-blue-700 hover:text-blue-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
        )}
        {profile.github && (
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        )}
        {profile.twitter && (
          <a
            href={profile.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-sky-500 hover:text-sky-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
            Twitter
          </a>
        )}
      </div>
    </div>
  </div>
);

// ─── Stats Bar ─────────────────────────────────────────────────────────────────

const StatsBar: React.FC<{ profile: Profile }> = ({ profile }) => (
  <div className="bg-white rounded-xl shadow-sm p-4">
    <div className="grid grid-cols-3 divide-x divide-gray-100">
      {[
        { label: 'Connections', value: profile.connections_count ?? 0 },
        { label: 'Posts', value: profile.posts_count ?? 0 },
        { label: 'Skills', value: profile.skills.length },
      ].map((stat) => (
        <div key={stat.label} className="text-center px-2">
          <div className="text-lg font-bold text-blue-600">
            {stat.value.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Collapsible Section ───────────────────────────────────────────────────────

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  defaultOpen = true,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2 font-semibold text-gray-800">
          {icon}
          {title}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
};

// ─── Skills Section ────────────────────────────────────────────────────────────

const SkillsSection: React.FC<{ skills: string[] }> = ({ skills }) => (
  <CollapsibleSection title="Skills" icon={<span>⚡</span>}>
    <div className="flex flex-wrap gap-2 pt-1">
      {skills.map((skill) => (
        <span
          key={skill}
          className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100"
        >
          {skill}
        </span>
      ))}
    </div>
  </CollapsibleSection>
);

// ─── Date Formatter ────────────────────────────────────────────────────────────

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  return `${MONTHS[parseInt(month, 10) - 1]} ${year}`;
};

// ─── Experience Section ────────────────────────────────────────────────────────

const ExperienceSection: React.FC<{ experience: Profile['experience'] }> = ({ experience }) => (
  <CollapsibleSection title="Experience" icon={<span>💼</span>}>
    <div className="space-y-5 pt-1">
      {experience.map((exp, idx) => (
        <div
          key={exp.id}
          className={`flex gap-4 ${idx < experience.length - 1 ? 'pb-5 border-b border-gray-100' : ''}`}
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 text-lg">
            🏢
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900">{exp.title}</h4>
            <p className="text-sm text-gray-700">
              {exp.company}
              {exp.location ? ` · ${exp.location}` : ''}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {formatDate(exp.start_date)} – {exp.current ? 'Present' : formatDate(exp.end_date)}
            </p>
            {exp.description && (
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{exp.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  </CollapsibleSection>
);

// ─── Education Section ─────────────────────────────────────────────────────────

const EducationSection: React.FC<{ education: Profile['education'] }> = ({ education }) => (
  <CollapsibleSection title="Education" icon={<span>🎓</span>}>
    <div className="space-y-5 pt-1">
      {education.map((edu, idx) => (
        <div
          key={edu.id}
          className={`flex gap-4 ${idx < education.length - 1 ? 'pb-5 border-b border-gray-100' : ''}`}
        >
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 text-lg">
            🏛️
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900">{edu.school}</h4>
            <p className="text-sm text-gray-700">
              {edu.degree}
              {edu.field ? ` · ${edu.field}` : ''}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {formatDate(edu.start_date)} – {formatDate(edu.end_date)}
            </p>
            {edu.description && (
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{edu.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  </CollapsibleSection>
);

// ─── Contact Section ───────────────────────────────────────────────────────────

const ContactSection: React.FC<{ profile: Profile }> = ({ profile }) => {
  const items = [
    { label: 'Email', value: profile.email, icon: '✉️' },
    { label: 'Phone', value: profile.phone, icon: '📞' },
    { label: 'Location', value: profile.location, icon: '📍' },
    { label: 'Website', value: profile.website, icon: '🌐' },
  ].filter((item) => item.value);

  if (!items.length) return null;

  return (
    <CollapsibleSection title="Contact Info" icon={<span>📋</span>} defaultOpen={false}>
      <div className="space-y-3 pt-1">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="text-lg">{item.icon}</span>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                {item.label}
              </p>
              <p className="text-sm text-gray-700">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
};

// ─── Time Ago ──────────────────────────────────────────────────────────────────

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
};

// ─── Activity Feed ─────────────────────────────────────────────────────────────

interface ActivityFeedProps {
  activity: Post[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activity, loading, hasMore, onLoadMore }) => (
  <CollapsibleSection title="Recent Activity" icon={<span>🕐</span>}>
    <div className="space-y-4 pt-1">
      {activity.map((post) => (
        <div
          key={post.id}
          className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
        >
          <img
            src={post.author_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
            alt={post.author_name}
            className="w-9 h-9 rounded-full flex-shrink-0 object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm text-gray-900">{post.author_name}</span>
              {post.type && post.type !== 'post' && (
                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full capitalize">
                  {post.type}
                </span>
              )}
              <span className="text-xs text-gray-400">{timeAgo(post.created_at)}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed line-clamp-3">
              {post.content}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {post.comments.length}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
    {hasMore && (
      <div className="mt-4 text-center">
        <button
          onClick={onLoadMore}
          disabled={loading}
          className="px-5 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading...
            </span>
          ) : (
            'Load more'
          )}
        </button>
      </div>
    )}
  </CollapsibleSection>
);

// ─── Loading Skeleton ──────────────────────────────────────────────────────────

const ProfileSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-32 sm:h-48 bg-gray-200" />
      <div className="px-6 pb-6">
        <div className="flex items-end space-x-4 -mt-12">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-300 border-4 border-white" />
          <div className="pb-2 space-y-2">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-28 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="mt-4 flex gap-4">
          <div className="h-4 w-24 bg-gray-100 rounded" />
          <div className="h-4 w-32 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-xl shadow-sm p-5 space-y-3">
        <div className="h-5 w-32 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-4/5 bg-gray-100 rounded" />
      </div>
    ))}
  </div>
);

// ─── Main ProfileView ──────────────────────────────────────────────────────────

const ACTIVITY_PAGE_SIZE = 2;

const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityPage, setActivityPage] = useState(1);
  const [activityLoading, setActivityLoading] = useState(false);
  const [displayedActivity, setDisplayedActivity] = useState<Post[]>([]);

  useEffect(() => {
    profileApi
      .getProfile()
      .then((data) => {
        setProfile(data);
        setDisplayedActivity(mockActivity.slice(0, ACTIVITY_PAGE_SIZE));
      })
      .catch(() => setError('Failed to load profile. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const loadMoreActivity = useCallback(() => {
    if (activityLoading) return;
    setActivityLoading(true);
    setTimeout(() => {
      const nextPage = activityPage + 1;
      setDisplayedActivity(mockActivity.slice(0, nextPage * ACTIVITY_PAGE_SIZE));
      setActivityPage(nextPage);
      setActivityLoading(false);
    }, 700);
  }, [activityPage, activityLoading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-sm w-full">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-500 mb-5">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const hasMoreActivity = displayedActivity.length < mockActivity.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <ProfileHeader profile={profile} />
        <StatsBar profile={profile} />
        {profile.bio && (
          <div className="bg-white rounded-xl shadow-sm px-5 py-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span>📄</span> About
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
          </div>
        )}
        <SkillsSection skills={profile.skills} />
        <ExperienceSection experience={profile.experience} />
        <EducationSection education={profile.education} />
        <ContactSection profile={profile} />
        <ActivityFeed
          activity={displayedActivity}
          loading={activityLoading}
          hasMore={hasMoreActivity}
          onLoadMore={loadMoreActivity}
        />
      </div>
    </div>
  );
};

export default ProfileView;
