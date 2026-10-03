'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/services/apiClient';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    college: '',
    graduationYear: '',
    collegeId: '',
    collegeIdFile: null
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setError('');
    setMessage('');

    if (!file) {
      setFormData({
        ...formData,
        collegeIdFile: null
      });
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG and PNG images are allowed');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('College ID photo must be less than 5MB');
      e.target.value = '';
      return;
    }

    setFormData({
      ...formData,
      collegeIdFile: file
    });

    setMessage('College ID photo selected successfully');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Enter a valid email');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Phone number must be 10 digits');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!formData.college.trim()) {
      setError('College is required');
      return;
    }

    if (!formData.graduationYear) {
      setError('Graduation year is required');
      return;
    }

    if (!formData.collegeId.trim()) {
      setError('College ID is required');
      return;
    }

    if (!formData.collegeIdFile) {
      setError('College ID photo is required');
      return;
    }

    try {
      setIsLoading(true);

      const data = new FormData();

      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('password', formData.password);
      data.append('college', formData.college);
      data.append('graduationYear', formData.graduationYear);
      data.append('collegeId', formData.collegeId);
      data.append('collegeIdFile', formData.collegeIdFile);

      await apiRequest(
        '/auth/register',
        'POST',
        data
      );

      setMessage(
        'Registration successful! OTP has been sent to your email.'
      );

      setTimeout(() => {
        router.push(
          `/verify-email?email=${encodeURIComponent(formData.email)}`
        );
      }, 500);

    } catch (error) {
      setError(
        error.message || 'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-xl shadow-2xl">

        <h2 className="text-2xl font-bold text-slate-100 mb-2">
          Create Account
        </h2>

        <p className="text-slate-400 text-sm mb-6">
          Register as a student on ShowMySkills.
        </p>

        {message && (
          <p className="text-sm text-green-400 mb-4">
            {message}
          </p>
        )}

        {error && (
          <p className="text-sm text-red-400 mb-4">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4"
        >

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Phone
            </label>

            <input
              type="tel"
              name="phone"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter 10-digit phone number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value.replace(/\D/g, '')
                })
              }
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* College */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              College
            </label>

            <input
              type="text"
              name="college"
              placeholder="Enter your college"
              value={formData.college}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Graduation Year */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Graduation Year
            </label>

            <select
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select graduation year</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029</option>
              <option value="2030">2030</option>
            </select>
          </div>

          {/* College ID */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              College ID
            </label>

            <input
              type="text"
              name="collegeId"
              placeholder="Enter your college ID"
              value={formData.collegeId}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
            />

            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mt-4 mb-1">
              Upload College ID
            </label>

            <input
              type="file"
              name="collegeIdFile"
              accept="image/jpeg,image/png"
              capture="environment"
              onChange={handleFileChange}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
            />

            <p className="text-xs text-slate-500 mt-1">
              Upload a JPG or PNG photo of your college ID. Maximum size: 5MB.
            </p>

            {formData.collegeIdFile && (
              <p className="text-xs text-green-400 mt-2">
                Selected: {formData.collegeIdFile.name}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

        </form>
      </div>
    </div>
  );
}