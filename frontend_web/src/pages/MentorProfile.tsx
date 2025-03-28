import React, { useState } from 'react';
import type { MentorProfile } from '../types';

const AVAILABLE_SKILLS = [
  "React", "TypeScript", "JavaScript", "Node.js", "Python",
  "Java", "Spring Boot", "Docker", "AWS", "MongoDB"
];

export default function MentorProfile() {
  const [profile, setProfile] = useState<MentorProfile>({
    id: 1,
    name: "Krupa Vyas",
    email: "krupa@example.com",
    experience: 5,
    githubId: "krupavyas",
    contact: "+1234567890",
    profile_pic_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    skills: [
      { name: "React", proficiency: 3 },
      { name: "TypeScript", proficiency: 2 },
      { name: "Python", proficiency: 1 }
    ]
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="bg-[#CAF0F8] rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-[#07193E]">Mentor Profile</h2>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="px-4 py-2 bg-[#0077B6] text-white rounded-lg hover:bg-[#07193E] transition-colors"
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={profile.profile_pic_url}
              alt={profile.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-[#0077B6]"
            />
            {isEditing && (
              <button className="text-[#0077B6] hover:text-[#07193E]">
                Change Photo
              </button>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#07193E]">Name</label>
            {isEditing ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0077B6]"
              />
            ) : (
              <p className="text-[#07193E]">{profile.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#07193E]">Email</label>
            <p className="text-[#07193E]">{profile.email}</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#07193E]">Experience (years)</label>
            {isEditing ? (
              <input
                type="number"
                value={profile.experience}
                onChange={(e) => setProfile({ ...profile, experience: parseInt(e.target.value) })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0077B6]"
              />
            ) : (
              <p className="text-[#07193E]">{profile.experience} years</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#07193E]">GitHub ID</label>
            {isEditing ? (
              <input
                type="text"
                value={profile.githubId}
                onChange={(e) => setProfile({ ...profile, githubId: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0077B6]"
              />
            ) : (
              <p className="text-[#07193E]">{profile.githubId}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#07193E]">Contact</label>
            {isEditing ? (
              <input
                type="text"
                value={profile.contact}
                onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0077B6]"
              />
            ) : (
              <p className="text-[#07193E]">{profile.contact}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#07193E]">Skills</label>
            <div className="space-y-2">
              {profile.skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <select
                        value={skill.name}
                        onChange={(e) => {
                          const newSkills = [...profile.skills];
                          newSkills[index].name = e.target.value;
                          setProfile({ ...profile, skills: newSkills });
                        }}
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#0077B6]"
                      >
                        {AVAILABLE_SKILLS.map((skillName) => (
                          <option key={skillName} value={skillName}>
                            {skillName}
                          </option>
                        ))}
                      </select>
                      <select
                        value={skill.proficiency}
                        onChange={(e) => {
                          const newSkills = [...profile.skills];
                          newSkills[index].proficiency = Number(e.target.value);
                          setProfile({ ...profile, skills: newSkills });
                        }}
                        className="p-2 border rounded-lg focus:ring-2 focus:ring-[#0077B6]"
                      >
                        {[1, 2, 3].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="bg-[#0077B6] text-white px-2 py-1 rounded-full">
                        {skill.name}
                      </span>
                      <span className="text-[#E8B712]">
                        {"★".repeat(skill.proficiency)}
                        {"☆".repeat(3 - skill.proficiency)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {isEditing && profile.skills.length < 10 && (
                <button
                  onClick={() => setProfile({
                    ...profile,
                    skills: [...profile.skills, { name: AVAILABLE_SKILLS[0], proficiency: 1 }]
                  })}
                  className="text-[#0077B6] hover:text-[#07193E]"
                >
                  + Add Skill
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}