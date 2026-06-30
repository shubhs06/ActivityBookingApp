import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', contactNumber: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerUser(form);
      navigate('/verify-otp', { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl mb-1">Create your account</h1>
        <p className="text-stone mb-8">Start booking activities in minutes.</p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Full name</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Contact number</label>
            <input
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="9876543210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="jane@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="input-field"
              placeholder="At least 6 characters"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-stone mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-terracotta font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
