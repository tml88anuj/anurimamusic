import React, { useState, useEffect, useRef } from 'react';
import { Heart, Play, Pause, Volume2, VolumeX, SkipForward } from 'lucide-react';

interface AudioTrack {
  id: string;
  name: string;
  artist: string;
  url: string;
  albumArt?: string;
}

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const particles = useRef<any[]>([]);

  // Your audio tracks with direct Google Drive download URLs
  const tracks: AudioTrack[] = [
    {
      id: '1',
      name: 'Your Special Song 1',
      artist: 'Anuj & Garima',
      url: '/audio/song1.mp3', // Place your audio file in public/audio/ folder
      albumArt: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      name: 'Your Special Song 2',
      artist: 'Anuj & Garima',
      url: '/audio/song2.mp3', // Place your audio file in public/audio/ folder
      albumArt: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  useEffect(() => {
    // Initialize particles
    particles.current = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.5 + 0.2
    }));

    // Animate particles
    const animateParticles = () => {
      particles.current.forEach(particle => {
        particle.y += particle.speed;
        if (particle.y > 100) {
          particle.y = -5;
          particle.x = Math.random() * 100;
        }
      });
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleLoadedData = () => {
      setPlayerError(null);
      setIsLoaded(true);
    };
    const handleError = () => {
      setPlayerError('Failed to load audio file. Please check the file format and try again.');
      setIsPlaying(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-play next track
      switchTrack();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    setPlayerError(null);

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling play:', error);
      setPlayerError('Failed to control playback');
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    const newMutedState = !isMuted;
    audioRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  const switchTrack = () => {
    if (tracks.length === 0) return;
    
    const nextTrack = (currentTrack + 1) % tracks.length;
    setCurrentTrack(nextTrack);
    setIsPlaying(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentTrackData = tracks[currentTrack];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-midnight-blue relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.current.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animation: `pulse ${2 + Math.random() * 2}s ease-in-out infinite`
            }}
          />
        ))}
      </div>

      {/* Floating Hearts Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-pink-300 opacity-20 animate-float"
            size={20 + Math.random() * 20}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-pixel text-white mb-4 animate-glow">
            Anurima
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Animated Hearts */}
        <div className="relative mb-12">
          <div className="heart-container">
            <Heart 
              className="heart-1 text-pink-500 animate-heartbeat" 
              size={60}
              fill="currentColor"
            />
            <Heart 
              className="heart-2 text-red-500 animate-heartbeat-delayed" 
              size={60}
              fill="currentColor"
            />
            <div className="connection-line"></div>
          </div>
        </div>

        {/* Romantic Quote */}
        <div className="text-center mb-12">
          <p className="text-xl md:text-2xl text-white font-cursive italic opacity-90 max-w-md leading-relaxed">
            "Where Anuj and Garima share music with each other"
          </p>
        </div>

        {/* Current Track Display */}
        {currentTrackData && (
          <div className="mb-8 text-center">
            {currentTrackData.albumArt && (
              <img 
                src={currentTrackData.albumArt} 
                alt={currentTrackData.name}
                className="w-32 h-32 rounded-lg mx-auto mb-4 shadow-lg object-cover"
              />
            )}
            <h3 className="text-white text-xl font-semibold">{currentTrackData.name}</h3>
            <p className="text-pink-300 text-lg">{currentTrackData.artist}</p>
          </div>
        )}

        {/* Music Controls */}
        <div className="flex flex-col items-center space-y-4 bg-black bg-opacity-30 rounded-2xl px-8 py-6 backdrop-blur-md min-w-[300px]">
          {playerError && (
            <div className="text-yellow-400 text-sm max-w-xs text-center mb-4">
              {playerError}
            </div>
          )}
          
          {/* Progress Bar */}
          <div className="w-full">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <div className="flex justify-between text-xs text-white mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center space-x-6">
            <button
              onClick={togglePlay}
              className="text-white hover:text-pink-300 transition-colors duration-300 transform hover:scale-110"
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
            
            <button
              onClick={switchTrack}
              className="text-white hover:text-pink-300 transition-colors duration-300 transform hover:scale-110"
            >
              <SkipForward size={32} />
            </button>
            
            <button
              onClick={toggleMute}
              className="text-white hover:text-pink-300 transition-colors duration-300 transform hover:scale-110"
            >
              {isMuted ? <VolumeX size={32} /> : <Volume2 size={32} />}
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <Volume2 size={16} className="text-white" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 accent-pink-500"
            />
          </div>

          {/* Track Info */}
          <div className="text-center">
            <p className="text-white text-sm opacity-75">
              ♪ Full track playing
            </p>
            <p className="text-pink-300 text-xs mt-1">
              Track {currentTrack + 1} of {tracks.length}
            </p>
          </div>
        </div>

        {/* Audio Visualizer */}
        {isPlaying && (
          <div className="mt-8 flex items-center justify-center space-x-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-t from-pink-500 to-purple-500 rounded-full animate-wave"
                style={{
                  width: '3px',
                  height: `${20 + Math.random() * 40}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        )}

        {/* No API Required */}
        <div className="mt-8 text-center">
          <p className="text-white text-xs opacity-50">
            Direct audio playback • No API required
          </p>
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrackData?.url}
        volume={volume}
        muted={isMuted}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
      />
    </div>
  );
}

export default App;