"use client";

import FusionPlayer from "@/components/ui/fusion-player";
import { Play, Zap, Settings, Shield, Keyboard, Monitor } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
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

      <div className="mb-16 p-4 rounded-[2rem] bg-neutral-50 dark:bg-neutral-900/50 border border-border  ">
        <FusionPlayer
          src="https://stream.mux.com/v02Kdrf701OOIiz01CDYpKztIx1MGvqtgrUyY02ZY2bVEzU.m3u8"
          poster="https://image.mux.com/v02Kdrf701OOIiz01CDYpKztIx1MGvqtgrUyY02ZY2bVEzU/thumbnail.png?time=137"
          timeline="https://image.mux.com/v02Kdrf701OOIiz01CDYpKztIx1MGvqtgrUyY02ZY2bVEzU/storyboard.vtt"
          colorScheme="#fff"
        />
      </div>

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
            <Monitor className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className=" font-bold mb-2">Cinema Mode</h3>
          <p className="text-sm text-neutral-500">
            Immersive viewing experience with a single click or &apos;T&apos;
            shortcut.
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
        <h2 className="text-2xl font-bold mb-4">
          Ready to implement?
        </h2>
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
