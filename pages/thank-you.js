import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ThankYouPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/user');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-gradient-to-br from-blue-400 to-purple-600 text-white">
      <div className="bg-white rounded-lg shadow-lg p-10 text-center max-w-md">
        <h1 className="text-5xl font-bold text-violet-600 mb-4 animate-pulse">Thank You!</h1>
        <p className="text-xl text-gray-700 mb-8">
          Thank you for voting. You will be redirected to the home page shortly.
        </p>
        <div className="flex justify-center mb-4">
          <svg
            className="w-16 h-16 text-violet-600 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div className="bg-violet-600 h-2.5 rounded-full transition-width duration-[5000ms]" style={{ width: '100%' }}></div>
        </div>
        <p className="text-sm text-gray-500">
          Redirecting in <span className="font-semibold">5 seconds</span>...
        </p>
      </div>
    </div>
  );
}
