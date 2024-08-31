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
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <h1 className="text-5xl font-extrabold text-white mb-8 text-center drop-shadow-lg">
        Welcome to Voting System
      </h1>
      <h2 className="text-3xl font-semibold text-white mb-12 text-center drop-shadow-md">
        Election of the Head of Informatics Engineering Department in 2024
      </h2>
      <p className="text-xl text-gray-200 mb-8 text-center max-w-2xl">
        Please login to participate in the voting process and make your voice heard in shaping the future of our department.
      </p>
      <div className="flex space-x-6">
        {!user ? (
          <button
            onClick={() => router.push('/user/login')}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 px-6 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300"
          >
            User Login
          </button>
        ) : (
          <>
            <button
              onClick={() => router.push('/user')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300"
            >
              Go to User Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-400 to-pink-500 text-white py-3 px-6 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
