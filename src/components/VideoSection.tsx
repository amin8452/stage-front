import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
      } else {
        await video.play();
        setIsPlaying(true);
      }
    } catch (err) {
      // Erreur de lecture vidéo ignorée
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const newMute = !isMuted;
    video.muted = newMute;
    setIsMuted(newMute);
  };

  const toggleFullscreen = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen?.();
      } else {
        await video.requestFullscreen?.();
      }
    } catch (err) {
      // Erreur plein écran ignorée
    }
  };

  return (
    <section className="py-20 px-4 bg-black text-white">
      <h2 className="text-3xl font-bold text-center mb-10">🎥 Démo Vidéo IA</h2>

      <div className="max-w-3xl mx-auto relative rounded-xl overflow-hidden shadow-2xl">
        <div className="relative aspect-video">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted={isMuted}
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onLoadedMetadata={() => {
              if (videoRef.current) videoRef.current.muted = isMuted;
            }}
          >
            <source src="/media/videoplayback.mp4" type="video/mp4" />
            <source src="/media/demo-video.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>

          {/* Controls always visible for testing */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/60 backdrop-blur-md rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="p-2 rounded-full bg-white/20 hover:bg-white/30">
                {isPlaying ? <Pause className="text-white w-5 h-5" /> : <Play className="text-white w-5 h-5" />}
              </button>
              <button onClick={toggleMute} className="p-2 rounded-full bg-white/20 hover:bg-white/30">
                {isMuted ? <VolumeX className="text-white w-5 h-5" /> : <Volume2 className="text-white w-5 h-5" />}
              </button>
            </div>
            <button onClick={toggleFullscreen} className="p-2 rounded-full bg-white/20 hover:bg-white/30">
              <Maximize className="text-white w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
