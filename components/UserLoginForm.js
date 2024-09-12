import { useState } from 'react';
import supabase from '../utils/supabase';
import { useRouter } from 'next/router';
import bcrypt from 'bcryptjs';

export default function UserLoginForm() {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('nim', nim)
        .single();

      if (error) {
        setError('Invalid NIM or password');
        return;
      }

      if (user && bcrypt.compareSync(password, user.password)) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ is_online: true })
          .eq('id', user.id);

        if (updateError) {
          setError('Failed to update user status');
          return;
        }

        localStorage.setItem('user', JSON.stringify(user));
        router.push('/user');
      } else {
        setError('Invalid NIM or password');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">User Login</h2>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div>
            <label htmlFor="nim" className="block text-sm font-medium text-gray-700">
              NIM
            </label>
            <input
              type="text"
              id="nim"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your NIM"
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
