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
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center">Admin Login</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleLogin} className="mt-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
        />
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-4">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
        />
        <button
          type="submit"
          className="mt-6 w-full bg-violet-600 text-white py-2 px-4 rounded-md hover:bg-violet-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}