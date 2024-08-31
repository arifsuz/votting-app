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
      // Fetch user data from Supabase
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('nim', nim)
        .single();

      if (error) {
        setError('Invalid NIM or password');
        return;
      }

      // Verify password
      if (user && bcrypt.compareSync(password, user.password)) {
        // Update user status to online
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
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center">User Login</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleLogin} className="mt-4">
        <label htmlFor="nim" className="block text-sm font-medium text-gray-700">
          NIM
        </label>
        <input
          type="text"
          id="nim"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
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