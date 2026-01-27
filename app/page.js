"use client";

import FusionPlayer from "@/components/ui/fusion-player";
import { useState } from "react";

export default function Home() {
  const [colorScheme, setColorScheme] = useState("#001959");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-neutral-900 text-white">
      <FusionPlayer
        src="https://stream.mux.com/01hdbfS3rAKVqWdh4n5jXcPJxT00q4hguWDxhRVMcFs7A.m3u8"
        poster="https://image.mux.com/01hdbfS3rAKVqWdh4n5jXcPJxT00q4hguWDxhRVMcFs7A/thumbnail.png"
        timeline="https://image.mux.com/01hdbfS3rAKVqWdh4n5jXcPJxT00q4hguWDxhRVMcFs7A/storyboard.vtt"
        colorScheme={colorScheme}
      />

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Theme Color:</label>
        <input
          type="color"
          value={colorScheme}
          onChange={(e) => setColorScheme(e.target.value)}
          className="w-10 h-10 rounded-full cursor-pointer bg-transparent border-none appearance-none"
        />
      </div>
    </div>
  );
}
