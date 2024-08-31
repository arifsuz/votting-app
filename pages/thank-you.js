import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ThankYouPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/user'); // Redirect to home page after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [router]);

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-gray-50 rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
      <p className="text-lg">Thank you for voting. You will be redirected to the home page shortly.</p>
    </div>
  );
}