import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl mb-1">Welcome back</h1>
        <p className="text-stone mb-8">Log in to manage your bookings.</p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              className="input-field"
              placeholder="Your password"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="text-sm text-stone mt-6 text-center">
          New here?{' '}
          <Link to="/register" className="text-terracotta font-medium hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
