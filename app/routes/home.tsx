import type { Route } from './+types/home';
import { useState } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Tubo - YouTube Video Downloader' },
    { name: 'description', content: 'Download YouTube videos easily' },
  ];
}

export default function HomePage(): React.ReactElement {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = async (url: string) => {
    if (!url.trim()) {
      setMessage("URL can't be empty");
      return;
    }

    try {
      setIsLoading(true);
      setProgress(0);
      setMessage('Starting download...');

      const progressBar = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) return prev + Math.random() * 5;
          return prev;
        });
      }, 300);
      
      const backendUrl = 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/video/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      clearInterval(progressBar);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to download video');
      }

      setProgress(100);
      setMessage(`Video downloaded successfully to: ${data.path}`);
      
      setTimeout(() => {
        setUrl('');
        setIsLoading(false);
      }, 1000)
    } catch (error) {
      setMessage('Error: ' + (error as Error).message);
      setIsLoading(false);
      setProgress(0);
    } 
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 select-none">
        <svg className="w-6 h-6" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" fill="#ef4444" />
          <polygon points="40,30 40,70 70,50" fill="white" />
        </svg>
        <span className="font-semibold text-gray-800">Tubo</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Download YouTube Videos
            </h1>
            <p className="text-gray-600 mb-6">
              Paste a YouTube URL below to get started
            </p>

            <div className="space-y-4">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleDownload(url)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-white border text-black border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />

              <span className="text-red-500">{message}</span>

              {isLoading && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-200 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              <button
                onClick={() => handleDownload(url)}
                disabled={isLoading}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-md transition-colors active:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Downloading...' : 'Download Video'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
