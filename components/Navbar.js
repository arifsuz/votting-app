import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import supabase from '../utils/supabase';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('admin'));
    const user = JSON.parse(localStorage.getItem('user'));
    if (admin) {
      setIsLoggedIn(true);
      setIsAdmin(true);
    } else if (user) {
      setIsLoggedIn(true);
      setIsAdmin(false);
    } else {
      setIsLoggedIn(false);
    }
  }, [router]);

  const handleLogout = async () => {
    const admin = JSON.parse(localStorage.getItem('admin'));
    const user = JSON.parse(localStorage.getItem('user'));

    if (admin) {
      const { error } = await supabase
        .from('admin')
        .update({ is_online: false })
        .eq('id', admin.id);

      if (error) {
        console.error('Failed to update admin status', error);
      }

      localStorage.removeItem('admin');
    } else if (user) {
      const { error } = await supabase
        .from('users')
        .update({ is_online: false })
        .eq('id', user.id);

      if (error) {
        console.error('Failed to update user status', error);
      }

      localStorage.removeItem('user');
    }

    setIsLoggedIn(false);
    router.push(isAdmin ? '/admin/login' : '/');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-3xl font-extrabold">
          {/* Gunakan Link tanpa <a> di dalamnya */}
          <Link href="/" className="hover:text-gray-200 transition duration-300">
            Voting System
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-white bg-red-600 px-4 py-2 rounded-full hover:bg-red-700 transition duration-300"
            >
              Logout
            </button>
          ) : (
            <>
              {/* Gunakan Link tanpa <a> di dalamnya */}
              <Link href="/user/login" className="text-white bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300">
                User Login
              </Link>
              <Link href="/admin/login" className="text-white bg-green-600 px-4 py-2 rounded-full hover:bg-green-700 transition duration-300">
                Admin Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}