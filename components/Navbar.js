import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import supabase from '../utils/supabase'; // Pastikan Anda telah mengimpor supabase

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
    <nav className="bg-violet-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          Voting System
        </div>
        <div className="flex items-center">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-white mr-4"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/user/login" className="text-white mr-4">User Login</Link>
              <Link href="/admin/login" className="text-white">Admin Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}