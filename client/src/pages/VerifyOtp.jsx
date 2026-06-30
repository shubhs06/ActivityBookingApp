import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { verifyOtp } from '../api/auth';

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtp({ email, otp });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6 text-center">
        <div>
          <p className="text-stone mb-4">No email found for verification.</p>
          <Link to="/register" className="text-terracotta font-medium hover:underline">
            Go back to sign up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl mb-1">Verify your email</h1>
        <p className="text-stone mb-8">
          We sent a 6-digit code to <span className="font-medium text-pine">{email}</span>
        </p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
        )}
        {success && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-[#E8F3EE] text-confirmed text-sm">
            Verified! Redirecting you to log in…
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
            className="input-field text-center font-mono text-xl tracking-[0.5em]"
            placeholder="······"
          />
          <button type="submit" disabled={loading || success} className="btn-primary">
            {loading ? 'Verifying…' : 'Verify email'}
          </button>
        </form>
      </div>
    </div>
  );
}
