import type { Route } from './+types/home';
import { useState, useEffect, useRef } from 'react';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Progress } from '~/components/ui/progress';
import { Download } from 'lucide-react';
import { cn } from '~/lib/utils'; // optional helper for conditional classes

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
  const backendUrl = 'http://localhost:3001';
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const clearProgress = () => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = null;
  };

  useEffect(() => clearProgress, []);

  const simulateProgress = () => {
    clearProgress();
    progressInterval.current = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + Math.random() * 3 : prev));
    }, 200);
  };

  const handleDownload = async (videoUrl: string) => {
    const trimmed = videoUrl.trim();
    if (!trimmed) {
      setMessage('Please enter a valid YouTube URL.');
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setMessage('Starting download...');
    simulateProgress();

    try {
      const response = await fetch(`${backendUrl}/api/video/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = await response.json();
      clearProgress();

      if (!response.ok)
        throw new Error(data.error || 'Failed to download video.');

      setProgress(100);
      setMessage(`Video downloaded successfully: ${data.path}`);

      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
        setUrl('');
        setMessage('');
      }, 2500);
    } catch (err) {
      clearProgress();
      setIsLoading(false);
      setProgress(0);
      setMessage((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-md px-6 py-4 flex items-center gap-3 select-none shadow-md">
        <svg className="w-7 h-7" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" fill="#ef4444" />
          <polygon points="40,30 40,70 70,50" fill="white" />
        </svg>
        <h1 className="font-semibold text-lg tracking-tight text-white">
          Tubo
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-xl border border-zinc-800 bg-zinc-900/90 text-zinc-100 shadow-xl rounded-2xl transition-all duration-300 hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center gap-2 text-white">
              <Download className="w-5 h-5 text-red-500" />
              Download YouTube Videos
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Paste a YouTube URL below to begin downloading.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && handleDownload(url)}
              placeholder="https://www.youtube.com/watch?v=..."
              disabled={isLoading}
              className="text-sm bg-zinc-800 border-zinc-700 placeholder:text-zinc-500 text-zinc-100 focus:ring-red-500 focus:border-red-500"
            />

            {message && (
              <p
                className={cn(
                  'text-sm',
                  message.startsWith('Video downloaded')
                    ? 'text-green-400'
                    : message.toLowerCase().includes('error') ||
                        message.toLowerCase().includes('failed')
                      ? 'text-red-400'
                      : 'text-zinc-400',
                )}
              >
                {message}
              </p>
            )}

            {isLoading && (
              <div className="pt-1">
                <Progress value={progress} className="h-2 bg-gray-300" />
              </div>
            )}

            <Button
              onClick={() => handleDownload(url)}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-all duration-200 disabled:bg-zinc-700 disabled:text-zinc-400"
            >
              {isLoading ? 'Downloading...' : 'Download Video'}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
