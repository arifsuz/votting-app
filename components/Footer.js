export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-700 py-6">
      <div className="container mx-auto text-center text-gray-300">
        <p className="text-lg font-semibold">© 2024 Voting App</p>
        <p className="mt-2">
          Developed by{' '}
          <a
            href="https://arifsuz.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600 transition duration-300"
          >
            Muhamad Nur Arif
          </a>
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <a
            href="https://github.com/arifsuz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.523 2 12c0 4.418 2.865 8.165 6.839 9.489.5.091.682-.217.682-.483 0-.237-.01-.866-.015-1.7-2.782.603-3.369-1.343-3.369-1.343-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.068-.608.068-.608 1.003.07 1.532 1.032 1.532 1.032.892 1.528 2.341 1.086 2.91.831.091-.647.349-1.086.636-1.337-2.22-.253-4.555-1.114-4.555-4.963 0-1.096.39-1.994 1.03-2.697-.103-.253-.447-1.268.097-2.64 0 0 .84-.27 2.75 1.026A9.561 9.561 0 0112 7.846a9.54 9.54 0 012.504.34c1.91-1.296 2.75-1.026 2.75-1.026.545 1.372.201 2.387.098 2.64.641.703 1.03 1.601 1.03 2.697 0 3.857-2.337 4.708-4.566 4.956.359.31.679.922.679 1.858 0 1.34-.012 2.42-.012 2.75 0 .267.18.577.688.48C19.138 20.164 22 16.418 22 12c0-5.477-4.477-10-10-10z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/marif8"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.447 20.452h-3.559v-5.413c0-1.29-.023-2.95-1.799-2.95-1.8 0-2.077 1.404-2.077 2.854v5.509H9.452v-11.14h3.413v1.523h.049c.476-.899 1.635-1.848 3.369-1.848 3.605 0 4.27 2.37 4.27 5.451v6.014zM5.337 7.433c-1.144 0-2.067-.926-2.067-2.067 0-1.142.923-2.067 2.067-2.067 1.143 0 2.067.925 2.067 2.067 0 1.141-.924 2.067-2.067 2.067zM6.787 20.452H3.887V9.313h2.9v11.139zM22.225 0H1.771C.792 0 .011.779.011 1.758v20.484c0 .979.781 1.758 1.76 1.758h20.454c.979 0 1.76-.779 1.76-1.758V1.758C23.986.779 23.205 0 22.225 0z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/arif_suz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7.75 2h8.5C19.02 2 22 4.98 22 8.75v6.5c0 3.77-2.98 6.75-6.75 6.75h-8.5C4.98 22 2 19.02 2 15.25v-6.5C2 4.98 4.98 2 7.75 2zM12 7.375a4.625 4.625 0 100 9.25 4.625 4.625 0 000-9.25zm0 7.75a3.125 3.125 0 110-6.25 3.125 3.125 0 010 6.25zm5.875-9.125a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
