"use client";

import { Button } from "@/components/ui/button";
import FusionPlayer from "@/components/ui/fusion-player";
import {
  Zap,
  Shield,
  Monitor,
  Smartphone,
  Layout,
  ArrowRight,
  Palette,
  PictureInPicture,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import Link from "next/link";
import Image from "next/image";
import { FiGithub } from "react-icons/fi";

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
    <div className="flex-1 w-full max-w-[1400px] mx-auto border-x border-border bg-background min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center min-h-[calc(100vh-50px)] justify-between px-8 lg:px-20 py-20 lg:py-10 gap-16">
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-8">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-xs font-medium text-primary">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Now with HLS Supporting
          </div> */}

          <h1 className="text-5xl xl:text-7xl font-bold tracking-tight text-primary leading-[1.1]">
            Experience Media <br />
            <span className="text-neutral-500 italic">Redefined.</span>
          </h1>

          <h2 className="text-lg xl:text-xl text-neutral-500  max-w-xl leading-relaxed">
            The ultimate open-source video player component for modern web
            applications. Performant, and dev-friendly.
          </h2>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <Link href="/docs">
              <Button className=" rounded-full py-6 px-6! group bg-foreground text-background font-bold text-base ">
                Get Started
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <div className="relative group">
              <button
                ref={triggerRef}
                onClick={() => setShowPicker(!showPicker)}
                className="flex items-center gap-3 px-6 py-3.5 rounded-full border border-neutral-300 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-900 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/20 transition-colors text-sm font-bold"
              >
                <div
                  className="w-4 h-4 rounded-full border dark:border-white/20 border-black/70"
                  style={{ backgroundColor: color.hex }}
                />
                Accent Color
                <Palette className="w-4 h-4 text-neutral-500" />
              </button>

              {showPicker && (
                <div
                  ref={pickerRef}
                  className="absolute top-full mt-4 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 z-50 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl"
                >
                  <ColorPicker
                    hideInput={["hsv"]}
                    hideAlpha={true}
                    color={color}
                    onChange={setColor}
                    width={220}
                    height={140}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-black bg-neutral-800 overflow-hidden"
                >
                  <Image
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                    alt="User"
                    width={32}
                    height={32}
                    unoptimized
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-neutral-500 font-medium">
              Trusted by <span className="text-primary font-bold">500+</span>{" "}
              developers
            </p>
          </div> */}
        </div>

        <div className="flex-1 w-full max-w-2xl relative">
          {/* <div className="absolute -inset-4 bg-linear-to-r from-blue-500/20 to-purple-500/20 blur-3xl opacity-20" /> */}
          <div className="rounded-xl bg-neutral-900/50 border border-neutral-800">
            <FusionPlayer
              src="https://stream.mux.com/01hdbfS3rAKVqWdh4n5jXcPJxT00q4hguWDxhRVMcFs7A.m3u8"
              poster="https://image.mux.com/01hdbfS3rAKVqWdh4n5jXcPJxT00q4hguWDxhRVMcFs7A/thumbnail.png"
              timeline="https://image.mux.com/01hdbfS3rAKVqWdh4n5jXcPJxT00q4hguWDxhRVMcFs7A/storyboard.vtt"
              colorScheme={color.hex}
            />
          </div>
          <div className="mt-3 text-end px-3">
            <p className="text-xs text-neutral-500 font-medium">
              Press{" "}
              <kbd className="px-1.5 py-0.5 rounded border border-neutral-700 bg-neutral-800 text-neutral-300 mx-1">
                Shift
              </kbd>{" "}
              +{" "}
              <kbd className="px-1.5 py-0.5 rounded border border-neutral-700 bg-neutral-800 text-neutral-300 font-mono">
                /
              </kbd>{" "}
              for shortcuts
            </p>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="px-8 lg:px-20 py-24 border-y border-border bg-neutral-100/65 dark:bg-neutral-900/15">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="w-5 h-5" />,
              title: "HLS / m3u8",
              desc: "Native support for adaptive streaming with automatic quality switching.",
            },
            {
              icon: <Layout className="w-5 h-5" />,
              title: "Fully Themed",
              desc: "Pass any color accent to perfectly match your application brand.",
            },
            {
              icon: <PictureInPicture className="w-5 h-5" />,
              title: "Picture-In-Picture",
              desc: "Pop the video into a floating window and keep watching while you multitask across apps or tabs.",
            },
            {
              icon: <Smartphone className="w-5 h-5" />,
              title: "Responsive",
              desc: "Fluid design that works perfectly on desktops, tablets, and mobile devices.",
            },
            {
              icon: <Shield className="w-5 h-5" />,
              title: "Open Source",
              desc: "Free to use and modify. Built for developers who love quality software.",
            },
            {
              icon: <Layout className="w-5 h-5" />,
              title: "Next.js Optimized",
              desc: "Optimized for the App Router and SSR. Zero configuration required.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-neutral-200/60 dark:bg-neutral-900/30 border border-neutral-300 dark:border-neutral-900 hover:border-neutral-400
               dark:hover:border-neutral-800 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-bold  mb-3">{feature.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 lg:px-20 py-32 text-center relative ">
        {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" /> */}
        <div className="relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold  mb-6">
            Ready to upgrade your player?
          </h2>
          <p className="text-neutral-500 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
            Join hundreds of developers who are already building better video
            experiences with Fusion Player. It&apos;s time to play.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/docs/installation/nextjs">
              <Button className="px-10 h-14 rounded-full font-bold text-lg">
                View Documentation
              </Button>
            </Link>
            <a
              href="https://github.com/RanaNakul/Video-player-Component"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="rounded-full py-7 px-6! group font-bold text-lg border border-neutral-300 dark:border-neutral-800"
              >
                <FiGithub className="w-5 h-5 mr-3" />
                GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
