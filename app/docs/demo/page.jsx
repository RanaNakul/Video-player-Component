"use client";

import FusionPlayer from "@/components/ui/fusion-player";
import { cn } from "@/lib/utils";
import {
  Settings,
  Keyboard,
  Code,
  View,
  Copy,
  PictureInPicture,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const CODE = {
  code: `"use client";
import React from "react";
import FusionPlayer from "@/components/ui/fusion-player";

export function VideoPageDome() {
      return (
          <div className="mb-16 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-border">
                  <FusionPlayer
                    src="https://stream.mux.com/v02Kdrf701OOIiz01CDYpKztIx1MGvqtgrUyY02ZY2bVEzU.m3u8"
                    poster="https://image.mux.com/v02Kdrf701OOIiz01CDYpKztIx1MGvqtgrUyY02ZY2bVEzU/thumbnail.png?time=137"
                    timeline="https://image.mux.com/v02Kdrf701OOIiz01CDYpKztIx1MGvqtgrUyY02ZY2bVEzU/storyboard.vtt"
                    colorScheme="#fff"
                  />
          </div>
      );
}`,
};

export default function DemoPage() {
  const [isShowPreview, setIsShowPreview] = useState(true);

  return (
    <div className="max-w-5xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Interactive Demo</h1>
        <p className="text-lg text-neutral-500 max-w-2xl">
          Experience the Fusion Player in action. This demo showcases its core
          features including HLS playback, custom themes, and seamless
          interactive controls.
        </p>
      </div>

      <div className="flex gap-1 bg-neutral-50 dark:bg-neutral-900/50 p-1 border border-border rounded-xl w-fit mb-3 select-none cursor-pointer">
        <div
          onClick={() => setIsShowPreview(true)}
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded-lg font-medium transition-all duration-300 ",
            isShowPreview && " bg-border",
          )}
        >
          <View className="size-4" /> Preview
        </div>
        <div
          onClick={() => setIsShowPreview(false)}
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded-lg font-medium transition-all duration-300",
            !isShowPreview && "bg-border",
          )}
        >
          <Code className="size-4" /> Code
        </div>
      </div>

      {isShowPreview ? (
        <div className="mb-16 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-border">
          <FusionPlayer
            src="https://stream.mux.com/v02Kdrf701OOIiz01CDYpKztIx1MGvqtgrUyY02ZY2bVEzU.m3u8"
            poster="https://image.mux.com/v02Kdrf701OOIiz01CDYpKztIx1MGvqtgrUyY02ZY2bVEzU/thumbnail.png?time=137"
            timeline="https://image.mux.com/v02Kdrf701OOIiz01CDYpKztIx1MGvqtgrUyY02ZY2bVEzU/storyboard.vtt"
            colorScheme="#fff"
          />
        </div>
      ) : (
        <div className="mb-20">
          <CodeBlock code={CODE.code} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-border">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
            <Settings className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className=" font-bold mb-2">Smart Settings</h3>
          <p className="text-sm text-neutral-500">
            Quality switching, playback speed, and a dedicated sleep timer
            built-in.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-border">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
            <PictureInPicture className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className=" font-bold mb-2">Picture-In-Picture</h3>
          <p className="text-sm text-neutral-500">
            Pop the video into a floating window with a single click or press &apos;i&apos; shortcut.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-border">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
            <Keyboard className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className=" font-bold mb-2">Full Shortcuts</h3>
          <p className="text-sm text-neutral-500">
            Keyboard-first navigation for power users. Press &apos;?&apos; for a
            guide.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-3xl  border border-border text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to implement?</h2>
        <p className="text-neutral-500 mb-8 max-w-lg mx-auto">
          Start building your custom player today with our easy-to-follow
          installation guide.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/docs/installation/nextjs"
            className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-colors border border-border"
          >
            Documentation
          </Link>
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ code }) {
  const parts = code.split(
    /(".*?"|'.*?'|`.*?`|\/\*[\s\S]*?\*\/|\/\/.*|@\w+|--\w+|(?:\b(?:div|className|return|function|VideoPageDome|React|FusionPlayer|import)\b))/g,
  );

  return (
    <div className="relative group ">
      <pre className="bg-neutral-100 dark:bg-neutral-900  p-4 rounded-xl border border-border overflow-x-auto font-mono text-sm leading-relaxed">
        {parts.map((part, i) => {
          if (!part) return null;
          if (/^["'`].*["'`]$/.test(part))
            return (
              <span key={i} className="text-amber-300">
                {part}
              </span>
            );
          if (/^(VideoPageDome)$/.test(part))
            return (
              <span key={i} className="text-amber-300">
                {part}
              </span>
            );
          if (/^\/\//.test(part) || /^\/\*/.test(part))
            return (
              <span key={i} className="text-neutral-500 italic">
                {part}
              </span>
            );
          if (/^@/.test(part))
            return (
              <span key={i} className="text-pink-400">
                {part}
              </span>
            );
          if (/^(return)$/.test(part))
            return (
              <span key={i} className="text-violet-400">
                {part}
              </span>
            );
          if (/^--/.test(part))
            return (
              <span key={i} className="text-sky-300">
                {part}
              </span>
            );
          if (/^(className|React|FusionPlayer)$/.test(part))
            return (
              <span key={i} className="text-sky-300">
                {part}
              </span>
            );

          if (
            /^(div|function|import)$/.test(
              part,
            )
          )
            return (
              <span key={i} className="text-sky-400">
                {part}
              </span>
            );
          return part;
        })}
      </pre>
      <button
        onClick={() => navigator.clipboard.writeText(code)}
        className="absolute top-3 right-3 p-2 rounded-md bg-border hover:bg-neutral-700 transition-all duration-300 cursor-pointer opacity-0 group-hover:opacity-100"
      >
        <Copy className="w-4 h-4 text-neutral-400" />
      </button>
    </div>
  );
}
