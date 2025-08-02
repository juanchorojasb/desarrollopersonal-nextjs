'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward } from 'lucide-react'

interface VideoPlayerProps {
  videoId: string
  title: string
  onProgress?: (progress: number) => void
  onComplete?: () => void
  initialProgress?: number
}

export function VideoPlayer({ videoId, title, onProgress, onComplete, initialProgress = 0 }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [quality, setQuality] = useState('720p')
  const [playbackRate, setPlaybackRate] = useState(1)
  
  // URL del video desde Bunny.net
  const videoUrl = `${process.env.NEXT_PUBLIC_BUNNY_CDN_URL}/${videoId}/playlist.m3u8`
  const posterUrl = `${process.env.NEXT_PUBLIC_BUNNY_CDN_URL}/${videoId}/thumbnail.jpg`

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100
      setCurrentTime(video.currentTime)
      onProgress?.(progress)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      if (initialProgress > 0) {
        video.currentTime = (initialProgress / 100) * video.duration
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onComplete?.()
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
    }
  }, [onProgress, onComplete, initialProgress])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleSeek = (time: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = time
    setCurrentTime(time)
  }

  const skipTime = (seconds: number) => {
    const video = videoRef.current
    if (!video) return

    const newTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds))
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div 
      className="relative bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-auto"
        poster={posterUrl}
        onClick={togglePlay}
        crossOrigin="anonymous"
      >
        <source src={videoUrl} type="application/x-mpegURL" />
        Tu navegador no soporta el elemento video.
      </video>

      {/* Loading Overlay */}
      {duration === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Progress Bar */}
        <div className="px-4 pb-2">
          <div className="relative">
            <div className="w-full h-1 bg-white bg-opacity-30 rounded-full cursor-pointer"
                 onClick={(e) => {
                   const rect = e.currentTarget.getBoundingClientRect()
                   const clickX = e.clientX - rect.left
                   const percentage = clickX / rect.width
                   handleSeek(percentage * duration)
                 }}>
              <div 
                className="h-full bg-purple-500 rounded-full transition-all duration-150"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-t from-black to-transparent">
          {/* Left Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlay}
              className="text-white hover:text-purple-300 transition-colors"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>

            <button
              onClick={() => skipTime(-10)}
              className="text-white hover:text-purple-300 transition-colors"
            >
              <SkipBack className="h-5 w-5" />
            </button>

            <button
              onClick={() => skipTime(10)}
              className="text-white hover:text-purple-300 transition-colors"
            >
              <SkipForward className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="text-white hover:text-purple-300 transition-colors"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
            </div>

            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            {/* Playback Speed */}
            <select
              value={playbackRate}
              onChange={(e) => {
                const rate = parseFloat(e.target.value)
                setPlaybackRate(rate)
                if (videoRef.current) {
                  videoRef.current.playbackRate = rate
                }
              }}
              className="bg-black bg-opacity-50 text-white text-sm rounded px-2 py-1 border border-white border-opacity-30"
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>

            <button className="text-white hover:text-purple-300 transition-colors">
              <Settings className="h-5 w-5" />
            </button>

            <button className="text-white hover:text-purple-300 transition-colors">
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
