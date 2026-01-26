"use client";

import VideoPlayer from "@/components/VideoPlayer";
import { useState } from "react";

export default function Home() {
  const [colorScheme, setColorScheme] = useState("#001959");
  return (
    <div className="min-h-screen flex items-center justify-center p-6 ">
      <div className="w-full">
        <VideoPlayer
          src="https://stream.mux.com/01hdbfS3rAKVqWdh4n5jXcPJxT00q4hguWDxhRVMcFs7A.m3u8"
          poster="https://image.mux.com/01hdbfS3rAKVqWdh4n5jXcPJxT00q4hguWDxhRVMcFs7A/thumbnail.png"
          timeline="https://image.mux.com/01hdbfS3rAKVqWdh4n5jXcPJxT00q4hguWDxhRVMcFs7A/storyboard.vtt"
          colorScheme={colorScheme}
        />

        <div className="mt-6 flex flex-col items-center">
          <input
            type="color"
            value={colorScheme}
            onChange={(e) => setColorScheme(e.target.value)}
            className="w-10 h-10 mt-4 outline-none border-none rounded-full cursor-pointer appearance-none                                                                                         "
          
          />
        </div>
      </div>
    </div>
  );
}
