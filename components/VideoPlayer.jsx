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
} from "lucide-react";

export default function VideoPlayer({ src, poster, timeline }) {
  const videoRef = useRef(null);
  const rangeRef = useRef(null);
  const hlsRef = useRef(null);
  const volumeRef = useRef(null);
  const containerRef = useRef(null);
  const sleepTimeoutRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [isCurrentTime, setIsCurrentTime] = useState(true);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
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
  const [lastVolume, setLastVolume] = useState(1);
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

  const playSafe = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();
    } catch (err) {
      // AbortError is normal — ignore it
      if (err.name !== "AbortError") {
        console.error("Play failed:", err);
      }
    }
  };

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

  return (
    <div className="">
      <div
        className={`relative  rounded-xl mx-auto group ${cinemaMode ? "w-full h-[73vh] bg-black" : " w-[60vw] h-full"} `}
        ref={containerRef}
      >
        <button
          onClick={() => {
            handlePlayPause();
            setIsSettingsOpen(false);
            setIsQualityOpen(false);
            setIsSpeedOpen(false);
            setIsSleepTimerOpen(false);
          }}
          className="absolute z-10 flex items-center justify-center inset-0 "
        >
          <div
            className={`bg-black/30 p-3 rounded-full transition-all duration-300 ease-out cursor-pointer ${isPlay ? "opacity-0 scale-90 pointer-events-none " : "opacity-100 scale-100"}`}
          >
            <Play className="size-10 text-white fill-white " />
          </div>
        </button>

        <video
          ref={videoRef}
          // controls
          playsInline
          preload="auto"
          poster={poster}
          onLoadedMetadata={() => setDuration(videoRef.current.duration)}
          onTimeUpdate={() => {
            const cur = videoRef.current.currentTime;
            setCurrentTime(cur);
            if (duration > 0) {
              setProgress((cur / duration) * 100);
            }
          }}
          onVolumeChange={() => setVolume(videoRef.current.volume)}
          className="w-full h-full rounded-lg  "
        />

        <div
          className="absolute bottom-0 w-full flex flex-col px-3 pb-2 z-20 gap-1.5 
          opacity-0 group-hover:opacity-100 transition-all duration-150 ease-out 
        "
        >
          <div className="relative">
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
                className="
                      relative w-full cursor-pointer
                      h-1 group-hover/progress:h-2
                      bg-neutral-500 rounded-lg appearance-none
                      bg-no-repeat bg-linear-to-r from-red-600 to-red-600
                      transition-[height] duration-150
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-5
                      [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:bg-transparent
                    "
                style={{
                  backgroundSize: `${progress}% 100%`,
                }}
              />
              <div
                className="absolute top-1/2 w-3 h-3 z-30 bg-red-600 rounded-full cursor-pointer -translate-x-1/2 -translate-y-1/2  pointer-events-none group-hover/progress:scale-[150%]  group-hover/progress:shadow-md   transition-transform duration-150"
                style={{
                  left: ` ${progress}%`,
                }}
              />
            </label>
          </div>

          <div className="relative flex items-center justify-between">
            <div className=" z-20 w-fit flex items-center gap-5 ">
              {/* play/pause button */}
              <button
                className=" bg-black/30 text-white py-1.5 px-1.5 rounded-full w-fit flex items-center  hover:bg-neutral-600/40 font-medium text-[15px] outline-4 outline-[#0000004D] transition-all duration-150 ease-out cursor-pointer"
                onClick={handlePlayPause}
              >
                {isPlay ? (
                  <Pause className="fill-white" />
                ) : (
                  <Play className="fill-white" />
                )}
              </button>

              {/* volume  */}
              <div className=" w-fit flex items-center  bg-black/30 py-1.5 px-1.5 rounded-full text-white hover:bg-neutral-600/40 font-medium text-[15px] outline-4 outline-[#0000004D]  transition-all duration-150 ease-out cursor-pointer select-none group/volume">
                <button
                  onClick={() => {
                    setLastVolume(videoRef.current.volume);
                    videoRef.current.volume = volume <= 0 ? lastVolume : 0;
                  }}
                >
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
                    console.log(val / 100);
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
              <button
                className="c py-1.5 px-3.5 rounded-full transition-all duration-150 ease-out "
                onClick={() => setIsSubtitlesOpen(!isSubtitlesOpen)}
              >
                <Captions
                  className={`${isSubtitlesOpen ? "text-white" : "text-white/50"} transition-all duration-150 ease-out`}
                />
              </button>

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
                  className="hover:bg-neutral-400/20.5 py-1.5 px-3.5 rounded-full transition-all duration-150 ease-out "
                >
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
                onClick={() => {
                  videoRef.current.requestPictureInPicture();
                }}
                className="hover:bg-neutral-400/20.5 py-1.5 px-3.5 rounded-full transition-all duration-150 ease-out "
              >
                <PictureInPicture />
              </button>

              {/* fullscreen */}
              <button
                onClick={() => {
                  if (!document.fullscreenElement) {
                    containerRef.current.requestFullscreen();
                  } else {
                    document.exitFullscreen();
                  }
                }}
                className="hover:bg-neutral-400/20.5 py-1.5 px-3.5 rounded-full transition-all duration-150 ease-out"
              >
                {isFullscreen ? (
                  <Minimize2 className=" rotate-90" />
                ) : (
                  <Maximize2 className=" rotate-90" />
                )}
              </button>
            </div>
          </div>

          {isSettingsOpen && (
            <div className="absolute bottom-16 right-2 flex flex-col items-center  bg-black/50 rounded-lg p-2 w-70 font-medium text-sm  ">
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
                  <p className="">Normal</p>
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
                  <p className="">Auto</p>
                  <ChevronRight className="size-4.5" />
                </div>
              </button>
            </div>
          )}

          {isQualityOpen && (
            <div className="absolute bottom-16 right-2 flex flex-col items-center  bg-black/50 rounded-lg py-2 w-50 font-medium text-sm transition-all duration-150 ease-out  ">
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
          )}

          {isSpeedOpen && (
            <div
              className="absolute bottom-16 right-2 flex flex-col items-center h-70  bg-black/50 rounded-lg py-2 w-50 font-medium text-sm transition-all duration-150 ease-out overflow-y-auto overflow-x-hidden 
             [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.25)_transparent]  "
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
                {[0.25, 0.5, 1, 1.25, 1.5, 1.75, 2, 2.5, 3].map(
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
          )}

          {isSleepTimerOpen && (
            <div
              className="absolute bottom-16 right-2 flex flex-col items-center h-70  bg-black/50 rounded-lg py-2 w-50 font-medium text-sm transition-all duration-150 ease-out overflow-y-auto overflow-x-hidden 
             [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.25)_transparent]  "
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
          )}
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

{
  /* <button
        className="bg-blue-500 text-white p-2 rounded-md"
        onClick={() => (videoRef.current.currentTime = 0)}
      >
        Reset
      </button>
      <button
        className="bg-blue-500 text-white p-2 rounded-md"
        onClick={() => (videoRef.current.currentTime = duration - 2)}
      >
        seek
      </button> */
}

// volume svg /
{
  /* <svg height="24" viewBox="0 0 24 24" width="24">
                      <path
                        class="ytp-svg-fill ytp-svg-volume-animation-speaker"
                        d="M 11.60 2.08 L 11.48 2.14 L 3.91 6.68 C 3.02 7.21 2.28 7.97 1.77 8.87 C 1.26 9.77 1.00 10.79 1 11.83 V 12.16 L 1.01 12.56 C 1.07 13.52 1.37 14.46 1.87 15.29 C 2.38 16.12 3.08 16.81 3.91 17.31 L 11.48 21.85 C 11.63 21.94 11.80 21.99 11.98 21.99 C 12.16 22.00 12.33 21.95 12.49 21.87 C 12.64 21.78 12.77 21.65 12.86 21.50 C 12.95 21.35 13 21.17 13 21 V 3 C 12.99 2.83 12.95 2.67 12.87 2.52 C 12.80 2.37 12.68 2.25 12.54 2.16 C 12.41 2.07 12.25 2.01 12.08 2.00 C 11.92 1.98 11.75 2.01 11.60 2.08 Z"
                        fill="#fff"
                      ></path>
                      <path
                        class="ytp-svg-volume-animation-small-ripple"
                        d=" M 15.53 7.05 C 15.35 7.22 15.25 7.45 15.24 7.70 C 15.23 7.95 15.31 8.19 15.46 8.38 L 15.53 8.46 L 15.70 8.64 C 16.09 9.06 16.39 9.55 16.61 10.08 L 16.70 10.31 C 16.90 10.85 17 11.42 17 12 L 16.99 12.24 C 16.96 12.73 16.87 13.22 16.70 13.68 L 16.61 13.91 C 16.36 14.51 15.99 15.07 15.53 15.53 C 15.35 15.72 15.25 15.97 15.26 16.23 C 15.26 16.49 15.37 16.74 15.55 16.92 C 15.73 17.11 15.98 17.21 16.24 17.22 C 16.50 17.22 16.76 17.12 16.95 16.95 C 17.6 16.29 18.11 15.52 18.46 14.67 L 18.59 14.35 C 18.82 13.71 18.95 13.03 18.99 12.34 L 19 12 C 18.99 11.19 18.86 10.39 18.59 9.64 L 18.46 9.32 C 18.15 8.57 17.72 7.89 17.18 7.3 L 16.95 7.05 L 16.87 6.98 C 16.68 6.82 16.43 6.74 16.19 6.75 C 15.94 6.77 15.71 6.87 15.53 7.05"
                        fill="#fff"
                        transform="translate(18, 12) scale(1) translate(-18,-12)"
                      ></path>
                      <path
                        class="ytp-svg-volume-animation-big-ripple"
                        d="M18.36 4.22C18.18 4.39 18.08 4.62 18.07 4.87C18.05 5.12 18.13 5.36 18.29 5.56L18.36 5.63L18.66 5.95C19.36 6.72 19.91 7.60 20.31 8.55L20.47 8.96C20.82 9.94 21 10.96 21 11.99L20.98 12.44C20.94 13.32 20.77 14.19 20.47 15.03L20.31 15.44C19.86 16.53 19.19 17.52 18.36 18.36C18.17 18.55 18.07 18.80 18.07 19.07C18.07 19.33 18.17 19.59 18.36 19.77C18.55 19.96 18.80 20.07 19.07 20.07C19.33 20.07 19.59 19.96 19.77 19.77C20.79 18.75 21.61 17.54 22.16 16.20L22.35 15.70C22.72 14.68 22.93 13.62 22.98 12.54L23 12C22.99 10.73 22.78 9.48 22.35 8.29L22.16 7.79C21.67 6.62 20.99 5.54 20.15 4.61L19.77 4.22L19.70 4.15C19.51 3.99 19.26 3.91 19.02 3.93C18.77 3.94 18.53 4.04 18.36 4.22 Z"
                        fill="#fff"
                        transform="translate(22, 12) scale(1) translate(-22, -12)"
                      ></path>
                    </svg>

                    <svg height="24" viewBox="0 0 24 24" width="24">
                      <path
                        d="M11.60 2.08L11.48 2.14L3.91 6.68C3.02 7.21 2.28 7.97 1.77 8.87C1.26 9.77 1.00 10.79 1 11.83V12.16L1.01 12.56C1.07 13.52 1.37 14.46 1.87 15.29C2.38 16.12 3.08 16.81 3.91 17.31L11.48 21.85C11.63 21.94 11.80 21.99 11.98 21.99C12.16 22.00 12.33 21.95 12.49 21.87C12.64 21.78 12.77 21.65 12.86 21.50C12.95 21.35 13 21.17 13 21V3C12.99 2.83 12.95 2.67 12.87 2.52C12.80 2.37 12.68 2.25 12.54 2.16C12.41 2.07 12.25 2.01 12.08 2.00C11.92 1.98 11.75 2.01 11.60 2.08ZM4.94 8.4V8.40L11 4.76V19.23L4.94 15.6C4.38 15.26 3.92 14.80 3.58 14.25C3.24 13.70 3.05 13.07 3.00 12.43L3 12.17V11.83C2.99 11.14 3.17 10.46 3.51 9.86C3.85 9.25 4.34 8.75 4.94 8.4ZM21.29 8.29L19 10.58L16.70 8.29L16.63 8.22C16.43 8.07 16.19 7.99 15.95 8.00C15.70 8.01 15.47 8.12 15.29 8.29C15.12 8.47 15.01 8.70 15.00 8.95C14.99 9.19 15.07 9.43 15.22 9.63L15.29 9.70L17.58 12L15.29 14.29C15.19 14.38 15.12 14.49 15.06 14.61C15.01 14.73 14.98 14.87 14.98 15.00C14.98 15.13 15.01 15.26 15.06 15.39C15.11 15.51 15.18 15.62 15.28 15.71C15.37 15.81 15.48 15.88 15.60 15.93C15.73 15.98 15.86 16.01 15.99 16.01C16.12 16.01 16.26 15.98 16.38 15.93C16.50 15.87 16.61 15.80 16.70 15.70L19 13.41L21.29 15.70L21.36 15.77C21.56 15.93 21.80 16.01 22.05 15.99C22.29 15.98 22.53 15.88 22.70 15.70C22.88 15.53 22.98 15.29 22.99 15.05C23.00 14.80 22.93 14.56 22.77 14.36L22.70 14.29L20.41 12L22.70 9.70C22.80 9.61 22.87 9.50 22.93 9.38C22.98 9.26 23.01 9.12 23.01 8.99C23.01 8.86 22.98 8.73 22.93 8.60C22.88 8.48 22.81 8.37 22.71 8.28C22.62 8.18 22.51 8.11 22.39 8.06C22.26 8.01 22.13 7.98 22.00 7.98C21.87 7.98 21.73 8.01 21.61 8.06C21.49 8.12 21.38 8.19 21.29 8.29Z"
                        fill="white"
                      ></path>
                    </svg> */
}
