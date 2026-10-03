'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiRequest } from '@/services/apiClient';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const emailFromUrl = searchParams.get('email');

    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [searchParams]);

  const handleVerify = async (e) => {
    e.preventDefault();

    setError('');

    if (!/^\d{6}$/.test(otp)) {
      setError('Enter a valid 6-digit OTP');
      return;
    }

    try {
      setIsLoading(true);

      await apiRequest(
        '/auth/verify-email',
        'POST',
        {
          email,
          otp
        }
      );

      router.push('/login');

    } catch (error) {
      setError(error.message || 'Email verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-xl shadow-2xl">

        <h2 className="text-2xl font-bold text-slate-100 mb-2">
          Verify Your Email
        </h2>

        <p className="text-slate-400 text-sm mb-6">
          Enter the 6-digit OTP sent to your email.
        </p>

        {error && (
          <p className="text-sm text-red-400 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleVerify} className="space-y-4">

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ''))
            }
            placeholder="Enter 6-digit OTP"
            autoFocus
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-center tracking-[0.5em] text-lg focus:outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>

        </form>
      </div>
    </div>
  );
}