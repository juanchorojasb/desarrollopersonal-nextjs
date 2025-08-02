'use client';

import { useState } from 'react';
import BunnyVideoPlayer from '@/components/video/BunnyVideoPlayer';

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState('');

  const sampleVideos = [
    {
      id: 'sample1',
      title: 'Introducción al Desarrollo Personal',
      url: 'https://desarrollopersonal.b-cdn.net/sample1.mp4',
      thumbnail: '/api/placeholder/320/180',
      duration: '10:30',
      category: 'Desarrollo Personal'
    },
    {
      id: 'sample2', 
      title: 'Técnicas de Mindfulness',
      url: 'https://desarrollopersonal.b-cdn.net/sample2.mp4',
      thumbnail: '/api/placeholder/320/180',
      duration: '15:45',
      category: 'Mindfulness'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Videos de Desarrollo Personal</h1>
        
        {selectedVideo ? (
          <div className="mb-8">
            <BunnyVideoPlayer 
              videoUrl={selectedVideo}
              title="Video en reproducción"
            />
            <button
              onClick={() => setSelectedVideo('')}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Volver al catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleVideos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative group cursor-pointer"
                     onClick={() => setSelectedVideo(video.url)}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                      <svg className="w-8 h-8 text-gray-800 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                  <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                    {video.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
