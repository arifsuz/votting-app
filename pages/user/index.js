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
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      {user ? (
        <div className="max-w-10xl mx-auto mt-1 p-4 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-violet-600 mb-6">User Dashboard</h1>
          <p className="text-lg text-gray-700 mb-4">Welcome, {user.name}!</p>
          <div className="flex flex-col space-y-4">
            {!user.has_voted && (
              <button
                onClick={() => router.push('/user/vote')}
                className="bg-violet-600 text-white py-2 px-4 rounded-md hover:bg-violet-700"
              >
                Go to Voting Page
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <p className="text-lg text-gray-700">Loading...</p>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}