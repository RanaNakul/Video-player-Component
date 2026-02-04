"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Download,
  PlayCircle,
  ChevronRight,
  Globe,
  Cpu,
  Layers,
  Terminal,
} from "lucide-react";

export default function DocsLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Introduction",
      href: "/docs",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      title: "Installation",
      icon: <Download className="w-4 h-4" />,
      items: [
        {
          title: "Install Next.js",
          href: "/docs/installation/nextjs",
          icon: <Globe className="w-3.5 h-3.5" />,
        },
        {
          title: "Install Tailwind CSS",
          href: "/docs/installation/tailwind",
          icon: <Layers className="w-3.5 h-3.5" />,
        },
        {
          title: "Add Utilities",
          href: "/docs/installation/utilities",
          icon: <Cpu className="w-3.5 h-3.5" />,
        },
        {
          title: "CLI",
          href: "/docs/installation/cli",
          icon: <Terminal className="w-3.5 h-3.5" />,
        },
      ],
    },
    {
      title: "Demo",
      href: "/docs/demo",
      icon: <PlayCircle className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex flex-1 px-8 py-12 mx-auto w-full max-w-[1400px] min-h-screen border-x border-border ">
      {/* Sidebar */}
      <aside className="w-64 flex-col gap-8 pr-8 border-r border-border hidden lg:flex">
        <div className="flex flex-col gap-1">
          <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-widest text-neutral-500">
            Navigation
          </p>

          {navItems.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200  ",
                    pathname === item.href
                      ? "bg-neutral-200 dark:bg-white/10 shadow-sm font-bold"
                      : "text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-900",
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ) : (
                <div className="my-2">
                  <div className="flex items-center gap-3 px-3 py-2 text-sm font-bold dark:text-neutral-200 ">
                    {item.icon}
                    {item.title}
                  </div>
                  <div className="mt-1 ml-4 flex flex-col gap-1 border-l border-border">
                    {item.items.map((subItem, subIdx) => (
                      <Link
                        key={subIdx}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-3 pl-6 pr-3 py-1.5 text-[13px] font-medium transition-all duration-200 border-l -ml-px",
                          pathname.includes(subItem.href)
                            ? "border-black dark:border-white bg-neutral-200 dark:bg-white/5"
                            : "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-700 dark:hover:border-neutral-500",
                        )}
                      >
                        {subItem.icon}
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-auto p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900/50 border border-border">
          <p className="text-xs font-semibold  mb-1">Need help?</p>
          <p className="text-[11px] text-neutral-500 leading-normal">
            Check our Github for issues or join our community.
          </p>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 pl-12">
        <div className="max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
