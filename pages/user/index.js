import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../utils/supabase';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      router.push('/user/login');
    } else {
      setUser(storedUser);
    }
  }, [router]);

  const handleLogout = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      const { error } = await supabase
        .from('users')
        .update({ is_online: false })
        .eq('id', user.id);

      if (error) {
        setError('Failed to update user status');
        return;
      }
    }

    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gradient-to-r from-violet-500 to-indigo-600">
      {user ? (
        <div className="max-w-4xl mx-auto mt-5 p-8 bg-white rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out">
          <h1 className="text-4xl font-bold text-violet-700 mb-6 text-center">User Dashboard</h1>
          <p className="text-xl text-gray-800 mb-8 text-center">Welcome, {user.name}!</p>
          <div className="flex flex-col items-center space-y-6">
            {!user.has_voted && (
              <button
                onClick={() => router.push('/user/vote')}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 px-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                Go to Voting Page
              </button>
            )}
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-400 to-pink-500 text-white py-3 px-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <p className="text-2xl text-white animate-pulse">Loading...</p>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
