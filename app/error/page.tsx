'use client';

import { useSearchParams } from 'next/navigation';

const ErrorPage = () => {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message') || 'An unexpected error occurred.';

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-700 mb-4">{errorMessage}</p>
        <a
          href="/"
          className="inline-block mt-4 px-4 py-2 bg-basePrimary text-white font-medium rounded-md hover:bg-blue-600"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
