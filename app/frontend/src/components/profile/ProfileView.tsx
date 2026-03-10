import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileApi } from "../profile/api";
import type { Profile } from "../../types";

const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileApi.getProfile().then((data) => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center mt-10">Profile not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Cover */}
      <div className="bg-blue-600 h-48 w-full"></div>

      <div className="max-w-4xl mx-auto px-4">

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow p-6 -mt-20 relative">

          {/* Avatar */}
          <div className="absolute -top-16 left-6">
            <div className="w-32 h-32 rounded-full bg-gray-300 border-4 border-white flex items-center justify-center text-4xl font-bold text-white">
              {profile.name.charAt(0)}
            </div>
          </div>

          <div className="ml-40">

            <div className="flex justify-between items-start">

              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>

                <p className="text-gray-600">
                  {profile.title || "No title added"}
                </p>

                <p className="text-sm text-gray-500">
                  {profile.location || "No location"}
                </p>

                <p className="text-sm text-gray-500">
                  {profile.connections_count || 0} connections
                </p>
              </div>

              <button
                onClick={() => navigate("/profile/edit")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Profile
              </button>

            </div>

            {/* Bio */}
            <p className="mt-4 text-gray-700">
              {profile.bio || "No bio added yet."}
            </p>

          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-xl shadow p-6 mt-6">

          <h2 className="text-lg font-semibold mb-4">Skills</h2>

          {profile.skills.length === 0 ? (
            <p className="text-gray-500">No skills added</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* Experience */}
        <div className="bg-white rounded-xl shadow p-6 mt-6">

          <h2 className="text-lg font-semibold mb-4">Experience</h2>

          {profile.experience.length === 0 ? (
            <p className="text-gray-500">No experience added</p>
          ) : (
            profile.experience.map((exp) => (
              <div key={exp.id} className="mb-4 border-b pb-4">

                <h3 className="font-semibold">{exp.title}</h3>

                <p className="text-gray-600">{exp.company}</p>

                <p className="text-sm text-gray-500">
                  {exp.start_date} - {exp.current ? "Present" : exp.end_date}
                </p>

                <p className="text-gray-700 mt-1">
                  {exp.description}
                </p>

              </div>
            ))
          )}

        </div>

        {/* Education */}
        <div className="bg-white rounded-xl shadow p-6 mt-6 mb-10">

          <h2 className="text-lg font-semibold mb-4">Education</h2>

          {profile.education.length === 0 ? (
            <p className="text-gray-500">No education added</p>
          ) : (
            profile.education.map((edu) => (
              <div key={edu.id} className="mb-4 border-b pb-4">

                <h3 className="font-semibold">{edu.school}</h3>

                <p className="text-gray-600">
                  {edu.degree} • {edu.field}
                </p>

                <p className="text-sm text-gray-500">
                  {edu.start_date} - {edu.end_date}
                </p>

                <p className="text-gray-700 mt-1">
                  {edu.description}
                </p>

              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
};

export default ProfileView;