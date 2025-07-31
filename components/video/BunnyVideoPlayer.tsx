'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react'

interface BunnyVideoPlayerProps {
  src: string
  thumbnail?: string
  title?: string
  onProgress?: (progress: number, currentTime: number, duration: number) => void
  onEnded?: () => void
  autoPlay?: boolean
  className?: string
}

export function BunnyVideoPlayer({
  src,
  thumbnail,
  title,
  onProgress,
  onEnded,
  autoPlay = false,
  className = ""
}: BunnyVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedData = () => setIsLoading(false)
    const handleTimeUpdate = () => {
      const current = video.currentTime
      const dur = video.duration
      setCurrentTime(current)
      if (onProgress && dur > 0) {
        onProgress((current / dur) * 100, current, dur)
      }
    }

    const handleLoadedMetadata = () => setDuration(video.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [onProgress, onEnded])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video || !duration) return

    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * duration
    
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const skip = (seconds: number) => {
    const video = videoRef.current
    if (!video) return

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds))
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time: number) => {
    if (!time || !isFinite(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div 
      className={`relative bg-black rounded-lg overflow-hidden group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={thumbnail}
        className="w-full h-full object-contain"
        autoPlay={autoPlay}
        preload="metadata"
        playsInline
        onClick={togglePlay}
      />

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}

      {/* Título */}
      {title && (
        <div className="absolute top-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <h3 className="text-lg font-semibold bg-black/50 backdrop-blur-sm px-3 py-2 rounded">
            {title}
          </h3>
        </div>
      )}

      {/* Botón de play central */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/30 w-20 h-20 rounded-full flex items-center justify-center transition-all"
          >
            <Play className="w-8 h-8 text-white ml-1" />
          </button>
        </div>
      )}

      {/* Controles */}
      {(showControls || !isPlaying) && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-4">
            {/* Barra de progreso */}
            <div 
              className="w-full h-2 bg-white/20 rounded-full cursor-pointer relative"
              onClick={handleSeek}
            >
              <div 
                className="absolute h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
              <div 
                className="absolute w-4 h-4 bg-blue-500 rounded-full -mt-1 transition-all transform -translate-x-2"
                style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>

            {/* Controles principales */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => skip(-10)}
                  className="text-white hover:bg-white/20 p-2 rounded transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20 p-2 rounded transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => skip(10)}
                  className="text-white hover:bg-white/20 p-2 rounded transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20 p-2 rounded transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente simple para thumbnails
export function VideoThumbnail({ 
  src, 
  thumbnail, 
  title, 
  duration,
  className = "",
  onClick 
}: {
  src: string
  thumbnail?: string
  title?: string
  duration?: number
  className?: string
  onClick?: () => void
}) {
  return (
    <div 
      className={`relative bg-gray-900 rounded-lg overflow-hidden cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {thumbnail ? (
        <img 
          src={thumbnail} 
          alt={title || 'Video thumbnail'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <Play className="w-12 h-12 text-white/60" />
        </div>
      )}
      
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 group-hover:bg-white/30 transition-colors">
            <Play className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {duration && (
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
        </div>
      )}

      {title && (
        <div className="absolute bottom-2 left-2 right-8 text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
          {title}
        </div>
      )}
    </div>
  )
}
