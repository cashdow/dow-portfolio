'use client';

import { useState } from 'react';

export default function AIPage() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl) return;

    setIsLoading(true);

    // 가상의 처리 시간
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const getYoutubeEmbedUrl = (url: string) => {
    try {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-cyan-400">
          AI Projects
        </h1>
        <p className="text-lg mb-12 max-w-2xl">
          Exploring the fascinating world of artificial intelligence and machine
          learning. Enter a YouTube URL below to analyze it with our AI tools.
        </p>

        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 md:p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-cyan-300">
            AI YouTube Analyzer
          </h2>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="mb-4">
              <label
                htmlFor="youtube-url"
                className="block text-sm font-medium mb-2 text-gray-300"
              >
                YouTube Video URL
              </label>
              <input
                id="youtube-url"
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !youtubeUrl}
              className={`px-6 py-3 rounded-md bg-cyan-600 text-white font-medium hover:bg-cyan-700 transition-colors w-full md:w-auto
                ${
                  isLoading || !youtubeUrl
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Analyze Video'
              )}
            </button>
          </form>

          {isSubmitted && (
            <div className="mt-8 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4 text-cyan-200">
                YouTube Video Preview
              </h3>
              <div className="relative aspect-video w-full mb-4">
                <iframe
                  src={getYoutubeEmbedUrl(youtubeUrl)}
                  className="absolute inset-0 w-full h-full rounded"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="bg-gray-800 p-4 rounded">
                <p className="text-sm text-gray-300 mb-2">
                  <strong>Analysis Status:</strong> We&apos;ve received your
                  request to analyze this video.
                </p>
                <p className="text-sm text-gray-300">
                  AI analysis features are coming soon! Check back later for
                  updates.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-cyan-300">
            AI Project Roadmap
          </h2>
          <div className="space-y-6">
            <div className="bg-black/30 p-6 rounded-lg border-l-4 border-cyan-400">
              <h3 className="text-xl font-bold mb-2">
                YouTube Content Analysis
              </h3>
              <p className="text-gray-300">
                Automatically extract and analyze content from YouTube videos
                using speech recognition and natural language processing.
              </p>
              <div className="mt-3 inline-block px-3 py-1 bg-cyan-900/50 rounded-full text-sm text-cyan-200">
                Planning Phase
              </div>
            </div>

            <div className="bg-black/30 p-6 rounded-lg border-l-4 border-cyan-400">
              <h3 className="text-xl font-bold mb-2">
                Image Generation with Descriptions
              </h3>
              <p className="text-gray-300">
                The goal is to use an image generation service to display images
                directly in a 3D environment, like in a gallery with pictures
                and descriptions beside them in a 3D tab.
              </p>
              <div className="mt-3 inline-block px-3 py-1 bg-cyan-900/50 rounded-full text-sm text-cyan-200">
                In Development
              </div>
            </div>

            <div className="bg-black/30 p-6 rounded-lg border-l-4 border-cyan-400">
              <h3 className="text-xl font-bold mb-2">
                Smart Route Finder: AI-Recommended Restaurants on Your Journey
              </h3>
              <p className="text-gray-300">
                A navigation app that shows nearby restaurants along the
                shortest route, with AI recommendations for the best dining
                spots.
              </p>
              <div className="mt-3 inline-block px-3 py-1 bg-cyan-900/50 rounded-full text-sm text-cyan-200">
                Planning Phase
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
