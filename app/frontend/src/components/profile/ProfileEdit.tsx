import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { profileApi } from './api';
import { mockFormValidationRules } from '../../data/mockData';
import type { Profile, ProfileFormData, ValidationErrors, Experience, Education } from '../../types';

// ─── Validation ────────────────────────────────────────────────────────────────

const validateField = (name: keyof typeof mockFormValidationRules, value: string): string => {
  const rules = mockFormValidationRules[name];
  if (!rules) return '';
  if ('required' in rules && rules.required && !value.trim()) {
    return rules.messages.required as string;
  }
  if ('minLength' in rules && rules.minLength && value.trim().length < rules.minLength) {
    return rules.messages.minLength as string;
  }
  if ('maxLength' in rules && rules.maxLength && value.trim().length > rules.maxLength) {
    return rules.messages.maxLength as string;
  }
  if ('pattern' in rules && rules.pattern && value.trim() && !rules.pattern.test(value.trim())) {
    return rules.messages.pattern as string;
  }
  return '';
};

// ─── Image Upload Zone ─────────────────────────────────────────────────────────

interface ImageUploadProps {
  currentAvatar?: string;
  onUpload: (file: File) => void;
  uploading: boolean;
  uploadProgress: number;
  previewUrl: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentAvatar,
  onUpload,
  uploading,
  uploadProgress,
  previewUrl,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) onUpload(acceptedFiles[0]);
    },
    [onUpload],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] },
    maxSize: 5 * 1024 * 1024, // 5 MB
    maxFiles: 1,
    disabled: uploading,
  });

  const displaySrc = previewUrl || currentAvatar || '';

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Avatar preview */}
      <div className="relative flex-shrink-0">
        {displaySrc ? (
          <img
            src={displaySrc}
            alt="Profile avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center text-3xl text-gray-400">
            👤
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
            <div className="text-white text-xs font-semibold">{uploadProgress}%</div>
          </div>
        )}
      </div>

      {/* Dropzone */}
      <div className="flex-1 w-full">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : uploading
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <svg
              className={`w-8 h-8 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {uploading ? (
              <div className="w-full">
                <p className="text-sm text-blue-600 mb-2">Uploading…</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : isDragActive ? (
              <p className="text-sm text-blue-600 font-medium">Drop image here</p>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, GIF, WebP up to 5 MB</p>
              </>
            )}
          </div>
        </div>
        {fileRejections.length > 0 && (
          <p className="mt-1.5 text-xs text-red-500">
            {fileRejections[0].errors[0].code === 'file-too-large'
              ? 'File is too large. Max size is 5 MB.'
              : 'Invalid file type. Please upload an image.'}
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Form Field ────────────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  hint?: string;
}

const FormField: React.FC<FieldProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  type = 'text',
  multiline,
  rows = 3,
  maxLength,
  hint,
}) => {
  const inputClass = `w-full px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 ${
    error
      ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
      : 'border-gray-300 focus:ring-blue-100 focus:border-blue-400'
  }`;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          rows={rows}
          maxLength={maxLength}
          placeholder={placeholder}
          className={inputClass}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          maxLength={maxLength}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
      <div className="flex justify-between mt-1">
        {error ? (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-gray-400">{hint}</p>
        ) : (
          <span />
        )}
        {maxLength && (
          <span className={`text-xs ${value.length > maxLength * 0.9 ? 'text-amber-500' : 'text-gray-400'}`}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Skills Input ──────────────────────────────────────────────────────────────

interface SkillsInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

const SkillsInput: React.FC<SkillsInputProps> = ({ skills, onChange }) => {
  const [input, setInput] = useState('');

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed) && skills.length < 30) {
      onChange([...skills, trimmed]);
      setInput('');
    }
  };

  const removeSkill = (skill: string) => onChange(skills.filter((s) => s !== skill));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
    if (e.key === 'Backspace' && !input && skills.length) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
      <div className="border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-colors min-h-[44px]">
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-100"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="text-blue-400 hover:text-blue-700 ml-0.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addSkill}
          placeholder={skills.length < 30 ? 'Type a skill and press Enter…' : 'Max 30 skills'}
          disabled={skills.length >= 30}
          className="w-full text-sm focus:outline-none bg-transparent placeholder-gray-400"
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">{skills.length}/30 skills · Press Enter or comma to add</p>
    </div>
  );
};

// ─── Experience Entry ──────────────────────────────────────────────────────────

type ExpEntry = Omit<Experience, 'id'>;

interface ExperienceEntryProps {
  exp: ExpEntry;
  index: number;
  onUpdate: (index: number, field: keyof ExpEntry, value: string | boolean) => void;
  onRemove: (index: number) => void;
}

const ExperienceEntry: React.FC<ExperienceEntryProps> = ({ exp, index, onUpdate, onRemove }) => (
  <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-semibold text-gray-700">Experience #{index + 1}</h4>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Remove
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Job Title *</label>
        <input
          type="text"
          value={exp.title}
          onChange={(e) => onUpdate(index, 'title', e.target.value)}
          placeholder="e.g. Software Engineer"
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Company *</label>
        <input
          type="text"
          value={exp.company}
          onChange={(e) => onUpdate(index, 'company', e.target.value)}
          placeholder="e.g. Acme Corp"
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
        <input
          type="text"
          value={exp.location ?? ''}
          onChange={(e) => onUpdate(index, 'location', e.target.value)}
          placeholder="e.g. San Francisco, CA"
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
        />
      </div>
      <div className="flex items-center gap-3 pt-5">
        <input
          type="checkbox"
          id={`current-${index}`}
          checked={exp.current}
          onChange={(e) => onUpdate(index, 'current', e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded"
        />
        <label htmlFor={`current-${index}`} className="text-sm text-gray-700">
          I currently work here
        </label>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
        <input
          type="month"
          value={exp.start_date}
          onChange={(e) => onUpdate(index, 'start_date', e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
        />
      </div>
      {!exp.current && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
          <input
            type="month"
            value={exp.end_date ?? ''}
            onChange={(e) => onUpdate(index, 'end_date', e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          />
        </div>
      )}
    </div>
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
      <textarea
        value={exp.description ?? ''}
        onChange={(e) => onUpdate(index, 'description', e.target.value)}
        rows={2}
        placeholder="Describe your responsibilities and achievements…"
        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none"
      />
    </div>
  </div>
);

// ─── Education Entry ───────────────────────────────────────────────────────────

type EduEntry = Omit<Education, 'id'>;

interface EducationEntryProps {
  edu: EduEntry;
  index: number;
  onUpdate: (index: number, field: keyof EduEntry, value: string) => void;
  onRemove: (index: number) => void;
}

const EducationEntry: React.FC<EducationEntryProps> = ({ edu, index, onUpdate, onRemove }) => (
  <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-semibold text-gray-700">Education #{index + 1}</h4>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Remove
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-gray-600 mb-1">School *</label>
        <input
          type="text"
          value={edu.school}
          onChange={(e) => onUpdate(index, 'school', e.target.value)}
          placeholder="e.g. Stanford University"
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Degree</label>
        <input
          type="text"
          value={edu.degree}
          onChange={(e) => onUpdate(index, 'degree', e.target.value)}
          placeholder="e.g. Bachelor of Science"
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Field of Study</label>
        <input
          type="text"
          value={edu.field}
          onChange={(e) => onUpdate(index, 'field', e.target.value)}
          placeholder="e.g. Computer Science"
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
        <input
          type="month"
          value={edu.start_date}
          onChange={(e) => onUpdate(index, 'start_date', e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
        <input
          type="month"
          value={edu.end_date ?? ''}
          onChange={(e) => onUpdate(index, 'end_date', e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
        />
      </div>
    </div>
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
      <textarea
        value={edu.description ?? ''}
        onChange={(e) => onUpdate(index, 'description', e.target.value)}
        rows={2}
        placeholder="Achievements, activities, GPA…"
        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none"
      />
    </div>
  </div>
);

// ─── Form Section Wrapper ──────────────────────────────────────────────────────

interface FormSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 space-y-4">
    <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-base border-b border-gray-100 pb-3">
      <span>{icon}</span> {title}
    </h3>
    {children}
  </div>
);

// ─── Submit Status ─────────────────────────────────────────────────────────────

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

// ─── Main ProfileEdit ──────────────────────────────────────────────────────────

const profileToFormData = (profile: Profile): ProfileFormData => ({
  name: profile.name,
  username: profile.username,
  email: profile.email,
  title: profile.title ?? '',
  location: profile.location ?? '',
  bio: profile.bio ?? '',
  phone: profile.phone ?? '',
  website: profile.website ?? '',
  linkedin: profile.linkedin ?? '',
  github: profile.github ?? '',
  twitter: profile.twitter ?? '',
  skills: [...profile.skills],
  experience: profile.experience.map(({ id: _id, ...rest }) => rest),
  education: profile.education.map(({ id: _id, ...rest }) => rest),
});

const SIMPLE_FIELDS = ['name', 'username', 'email', 'title', 'location', 'bio', 'phone', 'website'] as const;

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ProfileFormData | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [submitError, setSubmitError] = useState('');

  // Image upload state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    profileApi.getProfile()
      .then((data) => {
        setProfile(data);
        setFormData(profileToFormData(data));
      })
      .catch(() => setSubmitError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  // ── Field handlers ──────────────────────────────────────────────────────────

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => prev ? { ...prev, [name]: value } : prev);
    if (touched[name] && name in mockFormValidationRules) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name as keyof typeof mockFormValidationRules, value),
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (name in mockFormValidationRules) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name as keyof typeof mockFormValidationRules, value),
      }));
    }
  };

  // ── Skills ──────────────────────────────────────────────────────────────────

  const handleSkillsChange = (skills: string[]) => {
    setFormData((prev) => prev ? { ...prev, skills } : prev);
  };

  // ── Experience ──────────────────────────────────────────────────────────────

  const updateExperience = (index: number, field: keyof ExpEntry, value: string | boolean) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const experience = [...prev.experience];
      experience[index] = { ...experience[index], [field]: value };
      return { ...prev, experience };
    });
  };

  const addExperience = () => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        experience: [
          ...prev.experience,
          { title: '', company: '', location: '', start_date: '', end_date: null, current: false, description: '' },
        ],
      };
    });
  };

  const removeExperience = (index: number) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return { ...prev, experience: prev.experience.filter((_, i) => i !== index) };
    });
  };

  // ── Education ───────────────────────────────────────────────────────────────

  const updateEducation = (index: number, field: keyof EduEntry, value: string) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const education = [...prev.education];
      education[index] = { ...education[index], [field]: value };
      return { ...prev, education };
    });
  };

  const addEducation = () => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        education: [
          ...prev.education,
          { school: '', degree: '', field: '', start_date: '', end_date: null, description: '' },
        ],
      };
    });
  };

  const removeEducation = (index: number) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return { ...prev, education: prev.education.filter((_, i) => i !== index) };
    });
  };

  // ── Image upload ────────────────────────────────────────────────────────────

  const handleAvatarUpload = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
    setPendingAvatarFile(file);
    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);
      }
    }, 150);
  };

  // ── Validation ──────────────────────────────────────────────────────────────

  const validateAll = (): boolean => {
    if (!formData) return false;
    const newErrors: ValidationErrors = {};
    const allTouched: Record<string, boolean> = {};

    for (const field of SIMPLE_FIELDS) {
      if (field in mockFormValidationRules) {
        const err = validateField(field as keyof typeof mockFormValidationRules, formData[field]);
        if (err) newErrors[field] = err;
        allTouched[field] = true;
      }
    }

    setErrors(newErrors);
    setTouched((prev) => ({ ...prev, ...allTouched }));
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !profile) return;

    if (!validateAll()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitStatus('submitting');
    setSubmitError('');

    try {
      let avatarUrl = profile.avatar_url;

      // Upload avatar if pending
      if (pendingAvatarFile) {
        const result = await profileApi.uploadAvatar(pendingAvatarFile);
        avatarUrl = result.avatar_url;
      }

      await profileApi.updateProfile({
        ...formData,
        avatar_url: avatarUrl,
        experience: formData.experience.map((exp, i) => ({ ...exp, id: profile.experience[i]?.id ?? i + 1 })),
        education: formData.education.map((edu, i) => ({ ...edu, id: profile.education[i]?.id ?? i + 1 })),
      });

      setSubmitStatus('success');
      setTimeout(() => navigate('/profile'), 1500);
    } catch {
      setSubmitStatus('error');
      setSubmitError('Failed to save profile. Please try again.');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <svg className="animate-spin w-8 h-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-500">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (!formData || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl p-8 text-center max-w-sm w-full shadow-sm">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-sm text-gray-500">{submitError || 'Could not load profile.'}</p>
        </div>
      </div>
    );
  }

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-sm text-gray-500">Update your professional information</p>
          </div>
        </div>

        {/* Success banner */}
        {submitStatus === 'success' && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-green-700">Profile saved! Redirecting…</p>
          </div>
        )}

        {/* Error banner */}
        {(submitStatus === 'error' || hasErrors) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">
              {submitError || 'Please fix the errors below before saving.'}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

          {/* Photo */}
          <FormSection title="Profile Photo" icon="📷">
            <ImageUpload
              currentAvatar={profile.avatar_url}
              onUpload={handleAvatarUpload}
              uploading={uploading}
              uploadProgress={uploadProgress}
              previewUrl={avatarPreview}
            />
          </FormSection>

          {/* Basic Info */}
          <FormSection title="Basic Information" icon="👤">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Full Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name ? errors.name : undefined}
                placeholder="Your full name"
                maxLength={100}
              />
              <FormField
                label="Username *"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.username ? errors.username : undefined}
                placeholder="your_username"
                maxLength={30}
                hint="Only letters, numbers, underscores"
              />
              <FormField
                label="Email *"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email ? errors.email : undefined}
                placeholder="you@example.com"
                type="email"
              />
              <FormField
                label="Job Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.title ? errors.title : undefined}
                placeholder="e.g. Software Engineer"
                maxLength={100}
              />
              <FormField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.location ? errors.location : undefined}
                placeholder="e.g. San Francisco, CA"
                maxLength={100}
              />
              <FormField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone ? errors.phone : undefined}
                placeholder="+1 (555) 000-0000"
                type="tel"
              />
            </div>
            <FormField
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.bio ? errors.bio : undefined}
              placeholder="Tell the world about yourself…"
              multiline
              rows={4}
              maxLength={500}
            />
          </FormSection>

          {/* Social Links */}
          <FormSection title="Social Links" icon="🔗">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.website ? errors.website : undefined}
                placeholder="https://yoursite.com"
                type="url"
              />
              <FormField
                label="LinkedIn"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.linkedin}
                placeholder="https://linkedin.com/in/you"
                type="url"
              />
              <FormField
                label="GitHub"
                name="github"
                value={formData.github}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.github}
                placeholder="https://github.com/you"
                type="url"
              />
              <FormField
                label="Twitter / X"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.twitter}
                placeholder="https://twitter.com/you"
                type="url"
              />
            </div>
          </FormSection>

          {/* Skills */}
          <FormSection title="Skills" icon="⚡">
            <SkillsInput skills={formData.skills} onChange={handleSkillsChange} />
          </FormSection>

          {/* Experience */}
          <FormSection title="Experience" icon="💼">
            <div className="space-y-4">
              {formData.experience.map((exp, idx) => (
                <ExperienceEntry
                  key={idx}
                  exp={exp}
                  index={idx}
                  onUpdate={updateExperience}
                  onRemove={removeExperience}
                />
              ))}
              <button
                type="button"
                onClick={addExperience}
                className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Experience
              </button>
            </div>
          </FormSection>

          {/* Education */}
          <FormSection title="Education" icon="🎓">
            <div className="space-y-4">
              {formData.education.map((edu, idx) => (
                <EducationEntry
                  key={idx}
                  edu={edu}
                  index={idx}
                  onUpdate={updateEducation}
                  onRemove={removeEducation}
                />
              ))}
              <button
                type="button"
                onClick={addEducation}
                className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Education
              </button>
            </div>
          </FormSection>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-8">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitStatus === 'submitting' || submitStatus === 'success'}
              className="flex-1 py-3 px-6 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center gap-2"
            >
              {submitStatus === 'submitting' ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving…
                </>
              ) : submitStatus === 'success' ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved!
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
