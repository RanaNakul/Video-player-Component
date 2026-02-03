import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import {  BookText, Home as HomeIcon, PlayCircle } from "lucide-react";
import { FiGithub  } from "react-icons/fi";


const Navbar = () => {
  return (
    <nav className="w-full h-[70px] border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
      <div className="w-full max-w-[1400px] mx-auto h-full flex items-center justify-between px-10 border-x border-border">
        <Link href="/" className="flex items-center gap-2 group">
          <p className="text-xl font-bold tracking-tight text-primary">
            Fusion <span className="text-neutral-500">Player</span>
          </p>
        </Link>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-primary/60 hover:text-primary transition-colors"
            >
              <HomeIcon className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/docs"
              className="flex items-center gap-2 text-sm font-medium text-primary/60 hover:text-primary transition-colors"
            >
              <BookText className="w-4 h-4" />
              Docs
            </Link>
            <Link
              href="/docs/demo"
              className="flex items-center gap-2 text-sm font-medium text-primary/60 hover:text-primary transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              Demo
            </Link>
          </div>

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/RanaNakul/Video-player-Component"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-primary/60 hover:text-primary transition-colors"
            >
              <FiGithub className="w-5 h-5" />
            </a>
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
