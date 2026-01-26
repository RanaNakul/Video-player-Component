"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Play,
  Volume1,
  Volume2,
  VolumeX,
  Pause,
  Maximize2,
  Minimize2,
  Settings,
  Settings2,
  Captions,
  CircleGauge,
  MoonStar,
  ChevronRight,
  ChevronLast,
  ChevronLeft,
  PictureInPicture,
  RotateCcw,
} from "lucide-react";

export default function VideoPlayer({ src, poster, timeline, colorScheme }) {
  const videoRef = useRef(null);
  const rangeRef = useRef(null);
  const hlsRef = useRef(null);
  const volumeRef = useRef(null);
  const containerRef = useRef(null);
  const sleepTimeoutRef = useRef(null);
  const lastVolumeRef = useRef(0.7);
  const cinemaModeRef = useRef(false);
  const DEFAULT_VOLUME = 0.7;

  const [currentTime, setCurrentTime] = useState(0);
  const [isCurrentTime, setIsCurrentTime] = useState(true);
  const [duration, setDuration] = useState(1);
  const [volume, setVolume] = useState(0.7);
  const [isPlay, setIsPlay] = useState(false);
  const [thumbnails, setThumbnails] = useState([]);
  const [hoverInfo, setHoverInfo] = useState({
    show: false,
    time: 0,
    x: 0,
    image: "",
    rect: null,
    left: 0,
    translateX: 0,
  });
  // const [lastVolume, setLastVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [qualities, setQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState(-1);
  const [isQualityOpen, setIsQualityOpen] = useState(false);
  const [manifestReady, setManifestReady] = useState(false);
  const [mediaAttached, setMediaAttached] = useState(false);
  const [sleepTime, setSleepTime] = useState(0);
  const [cinemaMode, setCinemaMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSubtitlesOpen, setIsSubtitlesOpen] = useState(false);
  const [isSpeedOpen, setIsSpeedOpen] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(1);
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState(false);

  const isSafari =
    typeof window !== "undefined" &&
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const parseTime = (timeStr) => {
    const parts = timeStr.split(":");
    let seconds = 0;
    if (parts.length === 3) {
      seconds =
        parseFloat(parts[0]) * 3600 +
        parseFloat(parts[1]) * 60 +
        parseFloat(parts[2]);
    } else {
      seconds = parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
    }
    return seconds;
  };

  useEffect(() => {
    if (!timeline) return;

    fetch(timeline)
      .then((res) => res.text())
      .then((text) => {
        const cues = [];
        const lines = text.split("\n");
        let currentCue = null;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.includes("-->")) {
            const parts = line.split("-->");
            const start = parseTime(parts[0].trim());
            const end = parseTime(parts[1].trim());
            currentCue = { start, end };
          } else if (currentCue && line.startsWith("http")) {
            const [url, hash] = line.split("#xywh=");
            currentCue.url = url;
            if (hash) {
              const [x, y, w, h] = hash.split(",").map(Number);
              currentCue.rect = { x, y, w, h };
            }
            cues.push(currentCue);
            currentCue = null;
          }
        }
        setThumbnails(cues);
      });
  }, [timeline]);

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.min(Math.max(x / rect.width, 0), 1);
    const time = percent * duration;
    const cue = thumbnails.find((c) => time >= c.start && time <= c.end);

    let translateX = 0;
    let left = 0;

    if (x >= cue.rect.w / 2) {
      translateX = -50;
      left = time / duration;
    }

    if (x >= rect.width - cue.rect.w / 2) {
      left = 1;
      translateX = -100;
    }

    setHoverInfo({
      show: true,
      time,
      x: e.clientX,
      image: cue ? cue.url : "",
      rect: cue ? cue.rect : null,
      left,
      translateX,
    });
  };

  const handlePlayPause = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setIsPlay(true);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      }
    } else {
      video.pause();
      setIsPlay(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    // Safari (native HLS)
    if (isSafari) {
      video.src = src;
      return;
    }

    // Other browsers
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
      });

      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // const levels = hls.levels;
        // const qualities = levels.map((level, index) => ({
        //   id: index,
        //   label: level.height + "p",
        //   width: level.width,
        //   height: level.height,
        // }));
        console.log("hls.levels: ", hls.levels);
        const reversedLevels = hls.levels.slice().reverse();
        setQualities(reversedLevels);
        setManifestReady(true);
      });

      // hls.on(Hls.Events.ERROR, (_, data) => {
      //   console.error("HLS error:", data);

      //   // Optional: handle fatal errors
      //   if (data.fatal) {
      //     switch (data.type) {
      //       case Hls.ErrorTypes.NETWORK_ERROR:
      //         console.warn("Network error — trying to recover");
      //         hls.startLoad();
      //         break;

      //       case Hls.ErrorTypes.MEDIA_ERROR:
      //         console.warn("Media error — trying to recover");
      //         hls.recoverMediaError();
      //         break;

      //       default:
      //         console.error("Fatal error — destroying HLS");
      //         hls.destroy();
      //         break;
      //     }
      //   }
      // });

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        setMediaAttached(true);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            hls.destroy();
          }
        }
      });

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    }
  }, [src, isSafari]);

  const handleQualityChange = (level) => {
    const hls = hlsRef.current;

    // 🔒 HARD guards (do not remove)
    if (!hls) return console.log("hls is not defined");
    if (!mediaAttached) return console.log("mediaAttached is not defined");
    if (!manifestReady) return console.log("manifestReady is not defined");
    if (!hls.media) return console.log("hls.media is not defined");
    if (!Array.isArray(hls.levels))
      return console.log("hls.levels is not defined");

    // Level bounds check
    if (level !== -1 && (level < 0 || level >= hls.levels.length)) {
      return;
    }

    try {
      if (level === -1) {
        // AUTO
        hls.currentLevel = -1;
        hls.nextLevel = -1;
      } else {
        // MANUAL
        hls.currentLevel = level;
      }

      setCurrentQuality(level);
    } catch (err) {
      console.error("Safe quality switch blocked crash:", err);
    }
  };

  const handleSleepTimeChange = (val) => {
    // clear old timer
    if (sleepTimeoutRef.current) {
      clearTimeout(sleepTimeoutRef.current);
      sleepTimeoutRef.current = null;
    }

    setSleepTime(val);

    // 🚫 Off selected → stop here
    if (val === 0) return;

    sleepTimeoutRef.current = setTimeout(
      () => {
        videoRef.current.pause();
        setSleepTime(0);
        sleepTimeoutRef.current = null;
      },
      val * 60 * 1000,
    );
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  function stepFrame(video, dir) {
    video.pause();
    const fps = 30;
    video.currentTime = Math.max(0, video.currentTime + (1 / fps) * dir);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  function togglePiP() {
    if (videoRef.current === null) return;
    if (videoRef.current !== null && videoRef.current.requestPictureInPicture) {
      videoRef.current.requestPictureInPicture();
    }
  }

  const toggleMuted = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.volume === 0) {
      // 🔊 Unmute
      video.volume = lastVolumeRef.current || 1;
      showVolumeToast(video.volume);
    } else {
      // 🔇 Mute
      lastVolumeRef.current = video.volume;
      video.volume = 0;
      showVolumeToast(0);
    }
  };

  function onToggleTheatreMode() {
    if (!cinemaModeRef.current) {
      cinemaModeRef.current = true;
      setCinemaMode(true);
    } else {
      cinemaModeRef.current = false;
      setCinemaMode(false);
    }
  }

  const volumeTimeoutRef = useRef(null);
  const [showVolumeUI, setShowVolumeUI] = useState(false);

  const showVolumeToast = (v) => {
    setShowVolumeUI(true);

    clearTimeout(volumeTimeoutRef.current);
    volumeTimeoutRef.current = setTimeout(() => {
      setShowVolumeUI(false);
    }, 1000);
  };

  useEffect(() => {
    const handleKeyDown = async (e) => {
      const target = e.target;

      // ⛔ Ignore typing
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const video = videoRef?.current;
      if (!video) return;

      switch (e.code) {
        case "Space":
        case "KeyK":
          e.preventDefault();
          handlePlayPause();
          break;

        case "KeyJ":
        case "ArrowLeft":
          video.currentTime = Math.max(0, video.currentTime - 10);
          break;

        case "KeyL":
        case "ArrowRight":
          video.currentTime = Math.min(
            video.duration - 1,
            video.currentTime + 10,
          );
          break;

        case "ArrowUp": {
          e.preventDefault();

          const newVolume = Math.min(1, video.volume + 0.05);
          video.volume = newVolume;
          setVolume(newVolume);

          volumeRef.current.value = newVolume * 100;
          showVolumeToast(newVolume);
          break;
        }

        case "ArrowDown": {
          e.preventDefault();

          const newVolume = Math.max(0, videoRef.current.volume - 0.05);
          videoRef.current.volume = newVolume;
          setVolume(newVolume);

          volumeRef.current.value = newVolume * 100;
          showVolumeToast(newVolume);
          break;
        }

        case "KeyM":
          toggleMuted();
          break;

        case "KeyF":
          toggleFullscreen(containerRef?.current || video);
          break;

        case "KeyI":
          togglePiP();
          break;

        case "KeyC":
          onToggleCaptions?.();
          break;

        case "KeyT":
          onToggleTheatreMode?.();
          break;

        case "Period":
          if (e.shiftKey) {
            video.playbackRate = Math.min(3, video.playbackRate + 0.25);
          } else {
            stepFrame(video, 1);
          }
          break;

        case "Comma":
          if (e.shiftKey) {
            video.playbackRate = Math.max(0.25, video.playbackRate - 0.25);
          } else {
            stepFrame(video, -1);
          }
          break;

        case "Digit0":
        case "Digit1":
        case "Digit2":
        case "Digit3":
        case "Digit4":
        case "Digit5":
        case "Digit6":
        case "Digit7":
        case "Digit8":
        case "Digit9": {
          const percent = Number(e.code.replace("Digit", "")) * 10;
          video.currentTime = (video.duration * percent) / 100;
          break;
        }

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="select-none focus:outline-none">
      <div
        className={`relative  rounded-xl mx-auto group ${cinemaMode ? "w-full h-[73vh] bg-black" : " w-[60vw] h-full"} select-none focus:outline-none bg-black `}
        ref={containerRef}
      >
        {showVolumeUI && (
          <div className="absolute top-6 left-[50%] -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none">
            <div
              className="bg-black/60 px-4 py-2 rounded-md text-white text-lg 
                    transition-opacity duration-150 ease-out"
            >
              {Math.round(volume * 100)}%
            </div>
          </div>
        )}
        <button
          onClick={() => {
            handlePlayPause();
            setIsSettingsOpen(false);
            setIsQualityOpen(false);
            setIsSpeedOpen(false);
            setIsSleepTimerOpen(false);
          }}
          className="absolute z-10 flex items-center justify-center inset-0 select-none focus:outline-none"
        >
          <div
            className={`bg-black/30 p-3 rounded-full transition-all select-none duration-300 ease-out cursor-pointer ${isPlay ? "opacity-0 scale-90 pointer-events-none " : "opacity-100 scale-100"} focus:outline-none`}
          >
            <Play className="size-10 text-white fill-white " />
          </div>
        </button>

        <video
          ref={videoRef}
          playsInline
          preload="auto"
          poster={poster}
          onLoadedMetadata={() => {
            const video = videoRef.current;
            if (!video) return;

            video.volume = DEFAULT_VOLUME;
            video.muted = DEFAULT_VOLUME === 0;

            setDuration(video.duration);
            setVolume(DEFAULT_VOLUME);
          }}
          onTimeUpdate={() => {
            const video = videoRef.current;
            if (!video) return;

            const cur = videoRef.current.currentTime;            
            setCurrentTime(cur);

            if (duration > 0) {
              setProgress((cur / duration) * 100);
            }
          }}
          onVolumeChange={() => setVolume(videoRef.current.volume)}
          className="w-full h-full rounded-lg select-none "
        />

        <div
          className="absolute bottom-0 w-full flex flex-col px-3 pb-2 z-20 gap-1.5 
          opacity-0 group-hover:opacity-100 transition-all duration-150 ease-out  select-none focus:outline-none
        "
        >
          <div className="relative select-none focus:outline-none">
            {/* hover thumbnail */}
            {!isSettingsOpen && hoverInfo.show && (
              <div
                className="absolute bottom-full mb-2  flex flex-col items-center pointer-events-none z-50"
                style={{
                  left: `${hoverInfo.left * 100}%`,
                  translate: `${hoverInfo.translateX}% 0%`,
                }}
              >
                {hoverInfo.image && hoverInfo.rect && (
                  <div
                    className="border border-white rounded-lg shadow-lg bg-no-repeat mb-2"
                    style={{
                      backgroundImage: `url(${hoverInfo.image})`,
                      backgroundPosition: `-${hoverInfo.rect.x}px -${hoverInfo.rect.y}px`,
                      // backgroundSize: `auto`,
                      width: `${hoverInfo.rect.w}px`,
                      height: `${hoverInfo.rect.h}px`,
                    }}
                  />
                )}
                <span className="bg-black/30 text-white text-xs px-3 py-2 rounded-full">
                  {`${Math.floor(hoverInfo.time / 60)
                    .toString()
                    .padStart(
                      2,
                      "0",
                    )}:${(Math.floor(hoverInfo.time) % 60).toString().padStart(2, "0")}`}
                </span>
              </div>
            )}
            <label className="relative w-full group/progress   h-4 flex items-center ">
              <input
                ref={rangeRef}
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={(e) => {
                  const val = e.target.value;
                  videoRef.current.currentTime = val;
                  if (duration > 0) {
                    setProgress((val / duration) * 100);
                  }
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() =>
                  setHoverInfo((prev) => ({ ...prev, show: true }))
                }
                onMouseLeave={() =>
                  setHoverInfo((prev) => ({ ...prev, show: false }))
                }
                className={`
                      relative w-full cursor-pointer
                      h-1 group-hover/progress:h-2
                      bg-neutral-500 rounded-lg appearance-none
                      bg-no-repeat
                      transition-[height] duration-150
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-5
                      [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:bg-transparent
                    `}
                style={{
                  backgroundSize: `${progress}% 100%`,
                  backgroundImage: `linear-gradient(to right, ${colorScheme}, ${colorScheme})`,
                }}
              />
              <div
                className={`absolute top-1/2 w-3 h-3 z-30  rounded-full cursor-pointer -translate-x-1/2 -translate-y-1/2  pointer-events-none group-hover/progress:scale-[150%]  group-hover/progress:shadow-md   transition-transform duration-150`}
                style={{
                  left: ` ${progress}%`,
                  backgroundColor: colorScheme,
                }}
              />
            </label>
          </div>

          <div className="relative flex items-center justify-between">
            <div className=" z-20 w-fit flex items-center gap-5 ">
              {/* play/pause button */}
              <button
                className=" bg-black/30 text-white py-1.5 px-1.5 rounded-full w-fit flex items-center  hover:bg-neutral-600/40 font-medium text-[15px] outline-4 outline-[#0000004D] transition-all duration-150 ease-out cursor-pointer group/playpause select-none"
                onClick={handlePlayPause}
              >
                <p className="w-fit bg-black/30 text-neutral-300 px-2 py-1.5 rounded-md text-xs absolute bottom-15 -left-1 font-bold group-hover/playpause:visible invisible transition-all duration-150 ease-out text-nowrap hover:select-none">
                  {isPlay <= 0 ? "Play" : "Pause"}{" "}
                  <span className="outline-neutral-400 outline px-0.75 py-px rounded-sm font-bold ">
                    K
                  </span>
                </p>
                {duration > 0 && currentTime >= duration - 0.2 ? (
                  <RotateCcw />
                ) : isPlay ? (
                  <Pause className="fill-white" />
                ) : (
                  <Play className="fill-white" />
                )}
              </button>

              {/* volume  */}
              <div className="relative w-fit flex items-center  bg-black/30 py-1.5 px-1.5 rounded-full text-white hover:bg-neutral-600/40 font-medium text-[15px] outline-4 outline-[#0000004D]  transition-all duration-150 ease-out cursor-pointer select-none group/volume">
                <p className="w-fit bg-black/30 text-neutral-300 px-2 py-1.5 rounded-md text-xs absolute bottom-15 -left-3 font-bold group-hover/volume:visible invisible transition-all duration-150 ease-out text-nowrap">
                  {volume <= 0 ? "Unmute" : "Mute"}{" "}
                  <span className="outline-neutral-400 outline px-0.75 py-px rounded-sm font-bold ">
                    M
                  </span>
                </p>

                <button onClick={() => toggleMuted()}>
                  {volume <= 0 ? (
                    <VolumeX
                      className={`transition-all duration-200 ease-out ${volume <= 0 ? "opacity-100 scale-100" : "opacity-0 scale-80"}`}
                    />
                  ) : volume <= 0.5 ? (
                    <Volume1
                      className={`fill-white transition-all duration-200 ease-out ${volume <= 0.5 ? "opacity-100 scale-100" : "opacity-0 scale-80"}`}
                    />
                  ) : (
                    <Volume2
                      className={`fill-white transition-all duration-200 ease-out ${volume > 0.5 ? "opacity-100 scale-100" : "opacity-0 scale-80"}`}
                    />
                  )}
                </button>

                <input
                  ref={volumeRef}
                  type="range"
                  min={0}
                  max={100}
                  value={volume * 100}
                  onChange={(e) => {
                    const val = e.target.value;
                    setVolume(val / 100);
                    videoRef.current.volume = val / 100;
                  }}
                  className="w-0 h-0.5  accent-amber-50 appearance-none [&::-webkit-slider-thumb]:cursor-pointer  bg-no-repeat bg-linear-to-r from-white to-white
                   bg-neutral-300/30 group-hover/volume:w-15 group-hover/volume:ml-1.5  group-hover/volume:mr-1 [&::-webkit-slider-thumb]:appearance-none group-hover/volume:[&::-webkit-slider-thumb]:appearance-auto
                   [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 transition-all duration-200 ease-in-out"
                  style={{
                    backgroundSize: `${volume * 100}% 100%`,
                  }}
                />
              </div>

              {/* time range */}
              <button
                className=" w-fit flex items-center gap-1 bg-black/30 py-1.5 px-4 rounded-full text-white hover:bg-neutral-600/40 font-medium text-[15px] outline-4 outline-[#0000004D] transition-all duration-150 ease-out cursor-pointer select-none"
                onClick={() => setIsCurrentTime(!isCurrentTime)}
              >
                {/*Current time / Remaining time */}
                <>
                  {isCurrentTime ? (
                    <p className="font-semibold">
                      {`${Math.floor(
                        currentTime / 60,
                      ).toString()}:${(Math.floor(currentTime) % 60).toString().padStart(2, "0")}`}
                    </p>
                  ) : (
                    <div className="flex items-center font-semibold">
                      <div className="w-1.25 h-0.5 bg-white"></div>
                      {(() => {
                        const remaining = Math.max(
                          0,
                          Math.ceil(duration - currentTime),
                        );
                        const mins = Math.floor(remaining / 60).toString();

                        const secs = Math.floor(remaining % 60)
                          .toString()
                          .padStart(2, "0");
                        return `${mins}:${secs}`;
                      })()}
                    </div>
                  )}
                </>
                <p>/</p>
                {/* total duration */}
                <p>
                  {`${Math.floor(
                    duration / 60,
                  ).toString()}:${(Math.floor(duration) % 60).toString().padStart(2, "0")}`}
                </p>
              </button>
            </div>

            <div className="relative z-20 w-fit flex items-center bg-black/30  rounded-full text-white  font-medium text-[15px] outline-4 outline-[#0000004D]  cursor-pointer select-none">
              {/* subtitles */}
              {/* <button
                className="c py-1.5 px-3.5 rounded-full transition-all duration-150 ease-out "
                onClick={() => setIsSubtitlesOpen(!isSubtitlesOpen)}
              >
                <Captions
                  className={`${isSubtitlesOpen ? "text-white" : "text-white/50"} transition-all duration-150 ease-out`}
                />
              </button> */}

              {/* settings */}
              <button
                className="hover:bg-neutral-400/20.5 py-1.5 px-3.5 rounded-full transition-all duration-150 ease-out "
                onClick={() => {
                  setIsSettingsOpen(!isSettingsOpen);
                  setIsQualityOpen(false);
                  setIsSpeedOpen(false);
                  setIsSleepTimerOpen(false);
                }}
              >
                <Settings
                  className={`${isSettingsOpen ? "rotate-31" : "rotate-0"} transition-all duration-150 ease-out`}
                />
              </button>

              {/* cinema mode */}
              {!isFullscreen && (
                <button
                  onClick={() => setCinemaMode(!cinemaMode)}
                  className="relative hover:bg-neutral-400/20.5 py-1.5 px-3.5 rounded-full transition-all duration-150 ease-out group/cinma select-none cursor-pointer"
                >
                  <p className="w-fit bg-black/30 text-neutral-300 px-2 py-1.5 rounded-md text-xs absolute bottom-15 -right-7 font-bold group-hover/cinma:visible invisible transition-all duration-150 ease-out text-nowrap">
                    {cinemaMode <= 0 ? "Cinema mode" : "Exit Cinema mode"}{" "}
                    <span className="outline-neutral-400 outline px-0.75 py-px rounded-sm font-bold ">
                      T
                    </span>
                  </p>
                  {cinemaMode ? (
                    <svg fill="none" height="24" viewBox="0 0 24 24" width="24">
                      <path
                        d="M21.20 3.01L21 3H3L2.79 3.01C2.30 3.06 1.84 3.29 1.51 3.65C1.18 4.02 .99 4.50 1 5V19L1.01 19.20C1.05 19.66 1.26 20.08 1.58 20.41C1.91 20.73 2.33 20.94 2.79 20.99L3 21H21L21.20 20.98C21.66 20.94 22.08 20.73 22.41 20.41C22.73 20.08 22.94 19.66 22.99 19.20L23 19V5C23.00 4.50 22.81 4.02 22.48 3.65C22.15 3.29 21.69 3.06 21.20 3.01ZM3 15V5H21V15H3ZM16.87 6.72H16.86L16.79 6.79L13.58 10L16.79 13.20C16.88 13.30 16.99 13.37 17.11 13.43C17.23 13.48 17.37 13.51 17.50 13.51C17.63 13.51 17.76 13.48 17.89 13.43C18.01 13.38 18.12 13.31 18.21 13.21C18.31 13.12 18.38 13.01 18.43 12.89C18.48 12.76 18.51 12.63 18.51 12.50C18.51 12.37 18.48 12.23 18.43 12.11C18.37 11.99 18.30 11.88 18.20 11.79L16.41 10L18.20 8.20L18.27 8.13C18.42 7.93 18.50 7.69 18.49 7.45C18.47 7.20 18.37 6.97 18.20 6.79C18.02 6.62 17.79 6.52 17.55 6.50C17.30 6.49 17.06 6.57 16.87 6.72ZM5.79 6.79C5.60 6.98 5.50 7.23 5.50 7.5C5.50 7.76 5.60 8.01 5.79 8.20L7.58 10L5.79 11.79L5.72 11.86C5.57 12.06 5.49 12.30 5.50 12.54C5.51 12.79 5.62 13.02 5.79 13.20C5.97 13.37 6.20 13.48 6.45 13.49C6.69 13.50 6.93 13.42 7.13 13.27L7.20 13.20L10.41 10L7.20 6.79C7.01 6.60 6.76 6.50 6.5 6.50C6.23 6.50 5.98 6.60 5.79 6.79ZM3 19V17H21V19H3Z"
                        fill="white"
                      ></path>
                    </svg>
                  ) : (
                    <svg height="24" viewBox="0 0 24 24" width="24">
                      <path
                        d="M21.20 3.01L21 3H3L2.79 3.01C2.30 3.06 1.84 3.29 1.51 3.65C1.18 4.02 .99 4.50 1 5V19L1.01 19.20C1.05 19.66 1.26 20.08 1.58 20.41C1.91 20.73 2.33 20.94 2.79 20.99L3 21H21L21.20 20.98C21.66 20.94 22.08 20.73 22.41 20.41C22.73 20.08 22.94 19.66 22.99 19.20L23 19V5C23.00 4.50 22.81 4.02 22.48 3.65C22.15 3.29 21.69 3.06 21.20 3.01ZM3 15V5H21V15H3ZM7.87 6.72L7.79 6.79L4.58 10L7.79 13.20C7.88 13.30 7.99 13.37 8.11 13.43C8.23 13.48 8.37 13.51 8.50 13.51C8.63 13.51 8.76 13.48 8.89 13.43C9.01 13.38 9.12 13.31 9.21 13.21C9.31 13.12 9.38 13.01 9.43 12.89C9.48 12.76 9.51 12.63 9.51 12.50C9.51 12.37 9.48 12.23 9.43 12.11C9.37 11.99 9.30 11.88 9.20 11.79L7.41 10L9.20 8.20L9.27 8.13C9.42 7.93 9.50 7.69 9.48 7.45C9.47 7.20 9.36 6.97 9.19 6.80C9.02 6.63 8.79 6.52 8.54 6.51C8.30 6.49 8.06 6.57 7.87 6.72ZM14.79 6.79C14.60 6.98 14.50 7.23 14.50 7.5C14.50 7.76 14.60 8.01 14.79 8.20L16.58 10L14.79 11.79L14.72 11.86C14.57 12.06 14.49 12.30 14.50 12.54C14.51 12.79 14.62 13.02 14.79 13.20C14.97 13.37 15.20 13.48 15.45 13.49C15.69 13.50 15.93 13.42 16.13 13.27L16.20 13.20L19.41 10L16.20 6.79C16.01 6.60 15.76 6.50 15.5 6.50C15.23 6.50 14.98 6.60 14.79 6.79ZM3 19V17H21V19H3Z"
                        fill="white"
                      ></path>
                    </svg>
                  )}
                </button>
              )}

              {/* picture in picture */}
              <button
                onClick={() => togglePiP()}
                className="relative hover:bg-neutral-400/20.5 py-1.5 px-3.5 rounded-full transition-all duration-150 ease-out group/pip select-none cursor-pointer "
              >
                <p className="w-fit bg-black/30 text-neutral-300 px-2 py-1.5 rounded-md text-xs absolute bottom-15 -right-10 font-bold group-hover/pip:visible invisible transition-all duration-150 ease-out text-nowrap">
                  Picture in Picture{" "}
                  <span className="outline-neutral-400 outline px-0.75 py-px rounded-sm font-bold ">
                    I
                  </span>
                </p>
                <PictureInPicture />
              </button>

              {/* fullscreen */}
              <button
                onClick={() => toggleFullscreen()}
                className="relative hover:bg-neutral-400/20.5 py-1.5 px-3.5 rounded-full transition-all duration-150 ease-out group/fullscreen select-none cursor-pointer "
              >
                <p className="w-fit bg-black/30 text-neutral-300 px-2 py-1.5 rounded-md text-xs absolute bottom-15 right-0 font-bold group-hover/fullscreen:visible invisible transition-all duration-150 ease-out text-nowrap">
                  {isFullscreen <= 0 ? "Full Screen" : "Exit Full Screen"}{" "}
                  <span className="outline-neutral-400 outline px-0.75 py-px rounded-sm font-bold ">
                    F
                  </span>
                </p>
                {isFullscreen ? (
                  <Minimize2 className=" rotate-90" />
                ) : (
                  <Maximize2 className=" rotate-90" />
                )}
              </button>
            </div>
          </div>

          {/* settings menu */}
          <div
            className={`absolute bottom-16 right-2 flex flex-col items-center bg-black/50 rounded-lg p-2 font-medium text-sm transition-all duration-150 ease-out origin-bottom-right ${
              isSettingsOpen
                ? "w-70 opacity-100 pointer-events-auto"
                : "w-65 opacity-0 pointer-events-none"
            } `}
          >
            <button
              className="flex items-center justify-between gap-2 w-full hover:bg-neutral-400/20.5 py-3 px-1.5 rounded-lg transition-all duration-150 ease-out"
              onClick={() => {
                setIsSleepTimerOpen(!isSleepTimerOpen);
                setIsSettingsOpen(!isSettingsOpen);
              }}
            >
              <div className="flex items-center gap-4">
                <MoonStar className="size-5" />
                <p className="text-neutral-300">Sleep timer</p>
              </div>
              <div className="flex items-center gap-1 text-neutral-400">
                <p className="">
                  {sleepTime === 0 ? "Off" : `${sleepTime} min`}
                </p>
                <ChevronRight className="size-4.5" />
              </div>
            </button>
            <button
              className="flex items-center justify-between gap-2 w-full hover:bg-neutral-400/20.5 py-3 px-1.5 rounded-lg transition-all duration-150 ease-out"
              onClick={() => {
                setIsSpeedOpen(!isSpeedOpen);
                setIsSettingsOpen(!isSettingsOpen);
              }}
            >
              <div className="flex items-center gap-4">
                <CircleGauge className="size-5" />
                <p className="text-neutral-300">Playback speed</p>
              </div>
              <div className="flex items-center gap-1 text-neutral-400">
                <p className="">{currentSpeed}x</p>
                <ChevronRight className="size-4.5" />
              </div>
            </button>
            <button
              className="flex items-center justify-between gap-2 w-full hover:bg-neutral-400/20.5 py-3 px-1.5 rounded-lg transition-all duration-150 ease-out"
              onClick={() => {
                setIsQualityOpen(!isQualityOpen);
                setIsSettingsOpen(!isSettingsOpen);
              }}
            >
              <div className="flex items-center gap-4">
                <Settings2 className="size-5" />
                <p className="text-neutral-300">Quality</p>
              </div>
              <div className="flex items-center gap-1 text-neutral-400">
                <p className="">
                  {currentQuality === -1
                    ? "Auto"
                    : currentQuality === 0
                      ? "360p"
                      : currentQuality === 1
                        ? "480p"
                        : currentQuality === 2
                          ? "720p"
                          : currentQuality === 3
                            ? "1080p"
                            : currentQuality === 4 && "1080p Premium"}
                </p>
                <ChevronRight className="size-4.5" />
              </div>
            </button>
          </div>

          {/* quality menu */}
          <div
            className={`absolute bottom-16 right-2 flex flex-col items-center  bg-black/50 rounded-lg py-2 font-medium text-sm transition-all duration-150 ease-out origin-bottom-right ${
              isQualityOpen
                ? "w-50 opacity-100 pointer-events-auto"
                : "w-40 opacity-0 pointer-events-none"
            } `}
          >
            <div className="w-full pt-2 pb-4 border-b border-white/20  px-2 transition-all duration-150 ease-out">
              <button
                onClick={() => {
                  setIsQualityOpen(!isQualityOpen);
                  setIsSettingsOpen(!isSettingsOpen);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <ChevronLeft className="size-5 text-white " />
                <p>Quality</p>
              </button>
            </div>
            <div className="w-full flex  flex-col p-2 ">
              {qualities.map((level, index) => {
                const isPremium = level.bitrate.toString() === "8231300";
                const isActive =
                  currentQuality === qualities.length - 1 - index;

                return (
                  <button
                    key={index}
                    disabled={isSafari || !manifestReady || !mediaAttached}
                    onClick={() =>
                      handleQualityChange(qualities.length - 1 - index)
                    }
                    className={`w-full text-left px-6 py-2 rounded-lg transition-all duration-150 ease-out
                        ${isActive ? "bg-neutral-400/30" : "hover:bg-neutral-400/20"}
                        disabled:opacity-40 disabled:pointer-events-none
                      `}
                  >
                    {level.height}p
                    {isPremium && (
                      <>
                        <br />
                        <span className="text-xs text-neutral-400">
                          Premium Bitrate
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
              <button
                disabled={isSafari || !manifestReady || !mediaAttached}
                onClick={() => handleQualityChange(-1)}
                className={`w-full text-left px-6 py-2 rounded-lg transition-all duration-150 ease-out
                      ${currentQuality === -1 ? "bg-neutral-400/30" : "hover:bg-neutral-400/20"}
                      disabled:opacity-40 disabled:pointer-events-none
                    `}
              >
                Auto
              </button>
            </div>
          </div>

          {/* playback speed menu */}
          <div
            className={`absolute bottom-16 right-2 flex flex-col items-center h-70  bg-black/50 rounded-lg py-2 font-medium text-sm transition-all duration-150 ease-out overflow-y-auto overflow-x-hidden 
             [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.25)_transparent]  origin-bottom-right ${
               isSpeedOpen
                 ? "w-50 opacity-100 pointer-events-auto"
                 : "w-40 opacity-0 pointer-events-none"
             } `}
          >
            <div className="w-full pt-2 pb-4 border-b border-white/20 px-2 transition-all duration-150 ease-out">
              <button
                onClick={() => {
                  setIsSpeedOpen(false);
                  setIsSettingsOpen(true);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <ChevronLeft className="size-5 text-white" />
                <p>Playback Speed</p>
              </button>
            </div>

            <div className="w-full flex flex-col p-2">
              {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3].map(
                (speed, index) => {
                  const isActive = currentSpeed === speed;

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentSpeed(speed);
                        videoRef.current.playbackRate = speed;
                      }}
                      className={`w-full text-left px-6 py-2 rounded-lg transition-all duration-150 ease-out ${isActive ? "bg-neutral-400/30" : "hover:bg-neutral-400/20"} `}
                    >
                      {speed}x
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {/* sleep timer menu */}
          <div
            className={`absolute bottom-16 right-2 flex flex-col items-center h-70 bg-black/50 rounded-lg py-2 font-medium text-sm transition-all duration-150 ease-out overflow-y-auto overflow-x-hidden 
             [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.25)_transparent] ${
               isSleepTimerOpen
                 ? "w-50 opacity-100 pointer-events-auto"
                 : "w-40 opacity-0 pointer-events-none"
             } `}
          >
            <div className="w-full pt-2 pb-4 border-b border-white/20 px-2 transition-all duration-150 ease-out">
              <button
                onClick={() => {
                  setIsSleepTimerOpen(false);
                  setIsSettingsOpen(true);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <ChevronLeft className="size-5 text-white" />
                <p>Sleep Timer</p>
              </button>
            </div>
            <div className="w-full flex flex-col p-2">
              {[0, 1, 5, 10, 15, 20, 25, 30].map((time, index) => {
                const isActive = sleepTime === time;

                return (
                  <button
                    key={index}
                    onClick={() => {
                      handleSleepTimeChange(isActive ? 0 : time);
                    }}
                    className={`w-full text-left px-6 py-2 rounded-lg transition-all duration-150 ease-out ${isActive ? "bg-neutral-400/30" : "hover:bg-neutral-400/20"} `}
                  >
                    {time === 0 ? "Off" : `${time} min`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* <track
          kind="subtitles"
          src="https://www.w3schools.com/html/hls.vtt"
          srcLang="en"
          default
        /> */
}
