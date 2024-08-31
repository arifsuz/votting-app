import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedAdmin = JSON.parse(localStorage.getItem('admin'));
    setUser(storedUser);
    setAdmin(storedAdmin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1 className="text-4xl font-bold text-violet-600 mb-6">Welcome to Voting System</h1>
      <p className="text-lg text-gray-700 mb-6 text-center">
        Please login to participate in the voting process.
      </p>
      <div className="flex space-x-4">
        {!user ? (
          <button
            onClick={() => router.push('/user/login')}
            className="bg-violet-600 text-white py-2 px-4 rounded-md hover:bg-violet-700"
          >
            User Login
          </button>
        ) : (
          <>
            <button
              onClick={() => router.push('/user')}
              className="bg-violet-600 text-white py-2 px-4 rounded-md hover:bg-violet-700"
            >
              Go to User Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}