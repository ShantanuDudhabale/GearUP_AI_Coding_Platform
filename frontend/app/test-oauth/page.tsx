'use client';

import { useState } from 'react';

export default function TestOAuthPage() {
  const [googleUrl, setGoogleUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  const calculateUrls = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const baseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
    
    const google = `${baseUrl}/api/auth/google`;
    const github = `${baseUrl}/api/auth/github`;
    
    setGoogleUrl(google);
    setGithubUrl(github);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">OAuth URL Test Page</h1>
      
      <div className="space-y-4 mb-8">
        <div className="bg-gray-900 p-4 rounded-lg">
          <p className="text-sm text-gray-400 mb-2">NEXT_PUBLIC_API_URL:</p>
          <p className="font-mono text-green-400">{process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}</p>
        </div>
      </div>

      <button
        onClick={calculateUrls}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold mb-8"
      >
        Calculate OAuth URLs
      </button>

      {googleUrl && (
        <div className="space-y-4">
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-2">Google OAuth URL:</p>
            <p className="font-mono text-blue-400 break-all">{googleUrl}</p>
            <a
              href={googleUrl}
              className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
            >
              Test Google OAuth
            </a>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-2">GitHub OAuth URL:</p>
            <p className="font-mono text-purple-400 break-all">{githubUrl}</p>
            <a
              href={githubUrl}
              className="inline-block mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm"
            >
              Test GitHub OAuth
            </a>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg">
        <p className="text-yellow-400 text-sm">
          <strong>Note:</strong> If you get a 404 error, the backend server might not be running or the routes are not properly configured.
        </p>
      </div>
    </div>
  );
}
