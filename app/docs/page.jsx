import {
  ArrowRight,
  Zap,
  Settings,
  Shield,
  Layout,
  Monitor,
  Keyboard,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: (
      <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center ">
        <Zap className="w-5 h-5 text-yellow-500" />
      </div>
    ),
    title: "Lightweight",
    description: "Built for speed and performance with minimal overhead.",
  },
  {
    icon: (
      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center ">
        <Settings className="w-5 h-5 text-blue-500" />
      </div>
    ),
    title: "Customizable",
    description: "Fully editable components built with Tailwind CSS.",
  },
  {
    icon: (
      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center ">
        <Monitor className="w-5 h-5 text-purple-500" />
      </div>
    ),
    title: "HLS Support",
    description:
      "Seamless adaptive streaming for a production-ready experience.",
  },
  {
    icon: (
      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center ">
        <Shield className="w-6 h-6 text-emerald-500" />
      </div>
    ),
    title: "Production Ready",
    description: "Battle-tested components ready for your next project.",
  },
  {
    icon: (
      <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center ">
        <Layout className="w-6 h-6 text-pink-500" />
      </div>
    ),
    title: "Modern UI",
    description: "Glassmorphism and sleek animations out of the box.",
  },
  {
    icon: (
      <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center ">
        <Keyboard className="w-6 h-6 text-sky-500" />
      </div>
    ),
    title: "Keyboard Controls",
    description: "Full accessibility with intuitive keyboard shortcuts.",
  },
];

export default function DocsHome() {
  return (
    <div className="max-w-4xl">
      <div className="mb-16">
        <h1 className="text-5xl font-extrabold text-primray mb-6 tracking-tight">
          Fusion <span className="text-neutral-500">Player</span>
        </h1>
        <p className="text-xl text-neutral-500 leading-relaxed mb-8">
          A modern, lightweight, and highly-customizable React video player
          built for the modern web. Designed with Next.js and Tailwind CSS in
          mind, it pairs a clean UI with power-user features while staying fully
          editable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl bg-neutral-200/60 dark:bg-neutral-900/30 border border-border hover:border-neutral-300
               dark:hover:border-neutral-700 transition-all group relative overflow-hidden"
          >
        <div className="absolute top-0 right-0 w-10 h-10 bg-white/30 blur-3xl rounded-full " />

            <div className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold  mb-2">{feature.title}</h3>
            <p className="text-neutral-500 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-3xl  border border-border relative overflow-hidden group">
        <h2 className="text-3xl font-bold  mb-4 relative z-10">
          Ideal for Developers
        </h2>
        <p className="text-neutral-500 text-lg leading-relaxed relative z-10 mb-6">
          Whether you&apos;re building a streaming platform, a portfolio, or a
          simple blog, Fusion Player provides the building blocks you need
          without the bloat of traditional players.
        </p>
        <div className="flex gap-4 relative z-10">
          <div className="px-4 py-2 bg-neutral-800 rounded-lg text-sm text-neutral-300 border border-neutral-700">
            Next.js 15+
          </div>
          <div className="px-4 py-2 bg-neutral-800 rounded-lg text-sm text-neutral-300 border border-neutral-700">
            Tailwind v4
          </div>
          <div className="px-4 py-2 bg-neutral-800 rounded-lg text-sm text-neutral-300 border border-neutral-700">
            React 19
          </div>
        </div>
      </div>
    </div>
  );
}
