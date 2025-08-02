"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  SkipBack, 
  SkipForward,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  MessageSquare
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  duration: number; // en segundos
  isCompleted?: boolean;
  notes?: Note[];
}

interface Note {
  id: string;
  content: string;
  timestamp: number; // en segundos
  createdAt: string;
}

interface CourseVideoPlayerProps {
  lesson: Lesson;
  onProgress?: (watchTime: number, percentage: number) => void;
  onComplete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  courseTitle?: string;
}

export default function CourseVideoPlayer({
  lesson,
  onProgress,
  onComplete,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
  courseTitle = "Curso"
}: CourseVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Estados del player
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  
  // Estados de funcionalidades
  const [showNotes, setShowNotes] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<Note[]>(lesson.notes || []);
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  
  // Timers
  const [hideControlsTimer, setHideControlsTimer] = useState<NodeJS.Timeout | null>(null);

  // Efecto para actualizar progreso
  useEffect(() => {
    if (isPlaying && videoRef.current) {
      const timer = setInterval(() => {
        const video = videoRef.current;
        if (video) {
          const time = video.currentTime;
          const dur = video.duration;
          const percentage = (time / dur) * 100;
          
          setWatchedPercentage(percentage);
          onProgress?.(time, percentage);
          
          // Marcar como completado si se ve más del 90%
          if (percentage > 90 && !lesson.isCompleted) {
            onComplete?.();
          }
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isPlaying, onProgress, onComplete, lesson.isCompleted]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls && isPlaying) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      setHideControlsTimer(timer);
    }
    
    return () => {
      if (hideControlsTimer) {
        clearTimeout(hideControlsTimer);
      }
    };
  }, [showControls, isPlaying, hideControlsTimer]);

  // Handlers del video
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setVolume(vol);
      setIsMuted(vol === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
    setShowSettings(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const addNote = () => {
    if (newNote.trim() && videoRef.current) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote.trim(),
        timestamp: videoRef.current.currentTime,
        createdAt: new Date().toISOString()
      };
      
      setNotes(prev => [...prev, note]);
      setNewNote('');
      
      // TODO: Guardar en base de datos
    }
  };

  const jumpToNote = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
    }
  };

  return (
    <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
      {/* Header del curso */}
      <div className="bg-gray-900 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">{lesson.title}</h2>
            <p className="text-gray-300 text-sm">{courseTitle}</p>
          </div>
          <div className="flex items-center gap-2">
            {lesson.isCompleted && (
              <div className="flex items-center text-green-400 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Completado
              </div>
            )}
            <div className="text-gray-300 text-sm">
              {Math.round(watchedPercentage)}% visto
            </div>
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div 
        className="relative aspect-video bg-black group cursor-pointer"
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src={lesson.videoUrl}
          className="w-full h-full"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Loading/Play overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <button 
              onClick={togglePlay}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all"
            >
              <Play className="w-8 h-8 text-gray-900 ml-1" />
            </button>
          </div>
        )}

        {/* Controls overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
          
          {/* Navigation arrows */}
          {hasPrevious && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrevious?.();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          
          {hasNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext?.();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Bottom controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Progress bar */}
            <div className="mb-4">
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-white bg-opacity-30 rounded-lg appearance-none cursor-pointer slider"
              />
              {/* Progress indicator */}
              <div className="flex justify-between text-white text-sm mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Play/Pause */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>

                {/* Skip buttons */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    skip(-10);
                  }}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    skip(10);
                  }}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    onClick={(e) => e.stopPropagation()}
                    className="w-20 h-1 bg-white bg-opacity-30 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Notes button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotes(!showNotes);
                  }}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>

                {/* Settings */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSettings(!showSettings);
                    }}
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  
                  {showSettings && (
                    <div className="absolute bottom-8 right-0 bg-black bg-opacity-90 rounded-lg p-3 min-w-48">
                      <div className="text-white text-sm mb-2">Velocidad de reproducción</div>
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => changePlaybackRate(rate)}
                          className={`block w-full text-left px-3 py-1 rounded text-sm transition-colors ${
                            playbackRate === rate 
                              ? 'bg-blue-600 text-white' 
                              : 'text-gray-300 hover:text-white hover:bg-gray-700'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fullscreen */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes panel */}
      {showNotes && (
        <div className="bg-gray-900 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Mis Notas
            </h3>
            <button
              onClick={() => setShowNotes(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Add note */}
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Añadir una nota en este momento..."
                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && addNote()}
              />
              <button
                onClick={addNote}
                disabled={!newNote.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded text-white transition-colors"
              >
                Añadir
              </button>
            </div>
          </div>

          {/* Notes list */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                No tienes notas aún. ¡Añade tu primera nota!
              </p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <button
                      onClick={() => jumpToNote(note.timestamp)}
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTime(note.timestamp)}
                    </button>
                    <span className="text-gray-500 text-xs">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-200">{note.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Progress indicator */}
      <div className="bg-gray-900 px-6 py-3">
        <div className="flex justify-between items-center text-sm text-gray-300">
          <span>Progreso de la lección</span>
          <span>{Math.round(watchedPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${watchedPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
