import { useState } from 'react';
import supabase from '../utils/supabase';
import { useRouter } from 'next/router';
import bcrypt from 'bcryptjs';

export default function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Fetch admin data from Supabase
      const { data: admin, error } = await supabase
        .from('admin')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        setError('Invalid email or password');
        return;
      }

      // Verify password
      if (admin && bcrypt.compareSync(password, admin.password)) {
        localStorage.setItem('admin', JSON.stringify(admin));
        router.push('/admin/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">Admin Login</h2>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-4">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition ease-in-out duration-300"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}