"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import FusionPlayer from "@/components/ui/fusion-player";
import SocialFlipButton from "@/components/ui/social-flip-button";
import { Github } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";

export default function Home() {
  const pickerRef = useRef(null);
  const triggerRef = useRef(null);
  const [color, setColor] = useColor("#ffffff");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (!showPicker) return;

    const handler = (e) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPicker]);

  return (
    <div className="min-h-screen flex flex-col  ">
      <div className=" w-full h-[100px] border-b border-primary">
        <div className="w-9/12  mx-auto  h-full flex items-center justify-between px-10 border-x border-primary">
          <p className="text-4xl font-bold">Fusion Player</p>
          <div className="flex items-center gap-4">
            <Button variant="ghost">Demo</Button>
            <Button variant="ghost">Docs</Button>
            <ModeToggle />
            <Github />
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-between px-20  mx-auto gap-6 w-9/12 h-full border-x border-primary">
        <div className="flex items-start flex-col gap-7">
          <h1 className="text-6xl font-bold ">Fusion Player</h1>
          <h2 className="text-2xl font-semibold">
            Everything you need to play media <br /> for modern web apps.
          </h2>
          <div className="flex items-center gap-3">
            <Button>Get Started</Button>
            <Button variant="ghost">View Component</Button>
            <div className="relative flex items-center gap-2 ">
              <div className="group/picker relative flex flex-col items-center">
                <p className="absolute -top-8 -left-11 opacity-0 bg-neutral-400/50 py-1 px-2  rounded-lg text-xs text-nowrap mb-1 group-hover/picker:opacity-100 transition-opacity duration-150 ease-in ">
                  Pick Accent Color
                </p>
                <div
                  ref={triggerRef}
                  className="w-6 h-6 rounded-full cursor-pointer outline-2 outline-neutral-950"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setShowPicker((prev) => !prev)}
                />
              </div>

              {showPicker && (
                <div ref={pickerRef} className="absolute -right-60 z-50">
                  <ColorPicker
                    hideInput={["hsv"]}
                    hideAlpha={true}
                    color={color}
                    onChange={setColor}
                    width={250}
                    height={150}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="">
          <FusionPlayer
            src="https://stream.mux.com/01hdbfS3rAKVqWdh4n5jXcPJxT00q4hguWDxhRVMcFs7A.m3u8"
            poster="https://image.mux.com/01hdbfS3rAKVqWdh4n5jXcPJxT00q4hguWDxhRVMcFs7A/thumbnail.png"
            timeline="https://image.mux.com/01hdbfS3rAKVqWdh4n5jXcPJxT00q4hguWDxhRVMcFs7A/storyboard.vtt"
            colorScheme={color.hex}
          />
          <p className="text-xs text-end mt-1 text-neutral-500 font-medium ">
            press{" "}
            <spam className="dark:text-neutral-300 text-neutral-950">
              shift + /
            </spam>{" "}
            for shortcuts{" "}
          </p>
        </div>
      </div>

      <div className="w-full h-[100px] border-t border-primary">
        <div className="w-9/12  mx-auto  h-full flex items-center justify-between px-10 border-x border-primary">
          <p className="text-[13px] ">@FusionPlayer, Inc. 2026</p>
          <div className="relative w-fit flex items-center group ">
            <p
              className="
                absolute right-0
                opacity-100
                transition-opacity duration-500 delay-400
                group-hover:opacity-0
                group-hover:delay-0
                text-[13px] text-nowrap
              "
            >
              Designed and developed by Nakul Rana
            </p>
            <SocialFlipButton />
          </div>
        </div>
      </div>
    </div>
  );
}
