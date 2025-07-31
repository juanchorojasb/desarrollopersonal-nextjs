'use client'

import { useState } from 'react'
import { BunnyVideoPlayer, VideoThumbnail } from '@/components/video/BunnyVideoPlayer'
import { useBunnyVideo } from '@/lib/bunny'

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  // Videos de ejemplo - reemplaza con tus videos reales de Bunny.net
  const videos = [
    {
      id: 1,
      filename: 'intro-desarrollo-personal.mp4',
      title: 'Introducción al Desarrollo Personal',
      description: 'Descubre los fundamentos del crecimiento personal y cómo empezar tu transformación.',
      category: 'Fundamentos',
      duration: 180, // 3 minutos
      isFree: true
    },
    {
      id: 2,
      filename: 'gestion-emocional.mp4', 
      title: 'Gestión Emocional Básica',
      description: 'Aprende técnicas fundamentales para gestionar tus emociones de manera efectiva.',
      category: 'Emociones',
      duration: 240, // 4 minutos
      isFree: true
    },
    {
      id: 3,
      filename: 'autoconocimiento.mp4',
      title: 'Autoconocimiento: El Primer Paso',
      description: 'Explora quién eres realmente y desarrolla una mayor consciencia de ti mismo.',
      category: 'Autoconocimiento', 
      duration: 300, // 5 minutos
      isFree: false
    }
  ]

  const handleVideoSelect = (filename: string) => {
    setSelectedVideo(filename)
  }

  const handleVideoProgress = (progress: number, currentTime: number, duration: number) => {
    console.log(`Progreso: ${progress.toFixed(1)}% - ${currentTime.toFixed(1)}s / ${duration.toFixed(1)}s`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Videos de Desarrollo Personal</h1>
              <p className="text-gray-600 mt-2">Contenido profesional con videos HD desde Bunny.net</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">🐰 Powered by Bunny.net CDN</p>
              <p className="text-sm text-blue-600">Ultra-fast video delivery</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {selectedVideo ? (
          /* Video Player Full */
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  ← Volver a la lista
                </button>
              </div>
              
              <BunnyVideoPlayer
                src={`https://desarrollopersonal.b-cdn.net/${selectedVideo}`}
                thumbnail={`https://desarrollopersonal.b-cdn.net/${selectedVideo.replace('.mp4', '_thumbnail_1s.jpg')}`}
                title={videos.find(v => v.filename === selectedVideo)?.title}
                onProgress={handleVideoProgress}
                onEnded={() => console.log('Video terminado')}
                className="aspect-video w-full max-w-4xl mx-auto"
              />
              
              <div className="mt-6">
                {videos.filter(v => v.filename === selectedVideo).map(video => (
                  <div key={video.id}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{video.title}</h2>
                    <p className="text-gray-600 mb-4">{video.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{video.category}</span>
                      <span>{Math.floor(video.duration / 60)} min</span>
                      {video.isFree && <span className="text-green-600 font-medium">Gratis</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Lista de Videos */
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Biblioteca de Videos</h2>
            
            {/* Videos Gratuitos */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🆓 Videos Gratuitos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.filter(video => video.isFree).map((video) => (
                  <div key={video.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <VideoThumbnail
                      src={`https://desarrollopersonal.b-cdn.net/${video.filename}`}
                      thumbnail={`https://desarrollopersonal.b-cdn.net/${video.filename.replace('.mp4', '_thumbnail_1s.jpg')}`}
                      title={video.title}
                      duration={video.duration}
                      className="aspect-video"
                      onClick={() => handleVideoSelect(video.filename)}
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{video.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{video.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{video.category}</span>
                        <span className="text-gray-500 text-xs">{Math.floor(video.duration / 60)} min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Videos Premium */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">⭐ Videos Premium</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.filter(video => !video.isFree).map((video) => (
                  <div key={video.id} className="bg-white rounded-lg shadow-sm overflow-hidden relative">
                    <div className="absolute top-2 right-2 z-10">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">Premium</span>
                    </div>
                    <VideoThumbnail
                      src={`https://desarrollopersonal.b-cdn.net/${video.filename}`}
                      thumbnail={`https://desarrollopersonal.b-cdn.net/${video.filename.replace('.mp4', '_thumbnail_1s.jpg')}`}
                      title={video.title}
                      duration={video.duration}
                      className="aspect-video"
                      onClick={() => handleVideoSelect(video.filename)}
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{video.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{video.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">{video.category}</span>
                        <span className="text-gray-500 text-xs">{Math.floor(video.duration / 60)} min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Información de prueba */}
            <div className="mt-12 bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">🧪 Página de Prueba del Video Player</h3>
              <div className="text-blue-800 text-sm space-y-2">
                <p>• <strong>CDN:</strong> Videos servidos desde tu Bunny.net (desarrollopersonal.b-cdn.net)</p>
                <p>• <strong>Player:</strong> Controles personalizados con progreso, volumen, saltos</p>
                <p>• <strong>Calidad:</strong> Optimización automática según conexión</p>
                <p>• <strong>Thumbnails:</strong> Generados automáticamente por Bunny.net</p>
                <p>• <strong>Estado:</strong> {selectedVideo ? 'Reproduciendo video' : 'Selecciona un video para reproducir'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
