import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import SocialFlipButton from "./ui/social-flip-button";
import { Button } from "./ui/button";
import { FaXTwitter } from "react-icons/fa6";
import { FiGithub  } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="w-full max-w-[1400px] mx-auto border-x border-border">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-10 py-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <p className="text-xl font-bold tracking-tight text-primary">
                Fusion <span className="text-neutral-500">Player</span>
              </p>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6">
              The modern standard for web video playback. Built for performance,
              and the developer experience.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/RanaNakul/Video-player-Component"
                target="_blank"
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <FiGithub  className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <FaXTwitter className="w-5 h-5" />
              </a>
              {/* <a
                href="#"
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a> */}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold  uppercase tracking-widest mb-6">
              Product
            </h4>
            <ul className="flex flex-col gap-4">
              <li>
                <Link
                  href="/docs"
                  className="text-sm text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/demo"
                  className="text-sm text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white transition-colors"
                >
                  Interactive Demo
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/installation/cli"
                  className="text-sm text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white transition-colors"
                >
                  CLI Tools
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">
              Resources
            </h4>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white transition-colors"
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/RanaNakul/Video-player-Component/issues"
                  target="_blank"
                  className="text-sm text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white transition-colors"
                >
                  GitHub Issues
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white transition-colors"
                >
                  Releases
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold  uppercase tracking-widest mb-6">
              Support
            </h4>
            <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
              Join our community for help and the latest updates.
            </p>
            <Link href="/docs/installation/nextjs">
              <Button className="w-full py-2.5 px-4 text-sm font-bold ">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="h-[70px] border-t border-border flex items-center justify-between px-10">
          <p className="text-[12px] text-neutral-500 tracking-tight">
            © 2026 FusionPlayer, Inc. All rights reserved.
          </p>

          <div className="relative group flex items-center">
            <div
              className="absolute right-0 opacity-100
                transition-opacity duration-500 delay-400
                group-hover:opacity-0
                group-hover:delay-0"
            >
              <p className="text-[12px] text-neutral-500 flex items-center gap-1.5 whitespace-nowrap">
                Designed with{" "}
                <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by{" "}
                <span className="text-primary font-medium">Nakul Rana</span>
              </p>
            </div>
            <div>
              <SocialFlipButton />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
