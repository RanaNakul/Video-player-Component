"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { Check, Copy } from "lucide-react";

const DOCS_CONTENT = {
  nextjs: {
    title: "Install Next.js",
    description: "Install Next.js with Create Next App",
    steps: [
      {
        title: "Create a new project",
        description:
          "Run the following command to create a new Next.js project:",
        code: "npx create-next-app@latest",
      },
      {
        title: "On installation, you'll see the following prompts:",
        description: "Choose the default options for most projects.",
        code: `What is your project named? my-app
Would you like to use TypeScript? No / Yes
Would you like to use ESLint? No / Yes
Would you like to use Tailwind CSS? No / Yes
Would you like to use \`src/\` directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to customize the default import alias (@/*)? No / Yes
What import alias would you like configured? @/*`,
      },
      {
        title: "Start the app",
        description:
          "Navigate to your project directory and start the development server:",
        code: "cd my-app\nnpm run dev",
      },
    ],
  },
  tailwind: {
    title: "Install Tailwind CSS",
    description: "Set up Tailwind CSS in your Next.js project",
    steps: [
      {
        title: "Install Tailwind CSS",
        description: "Install tailwindcss and its companion packages via npm:",
        code: "npm install tailwindcss @tailwindcss/postcss @tailwindcss/cli",
      },
      {
        title: "Create your CSS file",
        description:
          "Create a new CSS file (e.g., app/globals.css) and add the Tailwind import:",
        code: `/* app/globals.css */
@import "tailwindcss";

@theme inline {
  /* Configure your theme variables here */
  --font-display: "Inter", "sans-serif";
  --color-primary-500: oklch(0.84 0.18 117.33);
  --spacing: 0.25rem;
}`,
      },
      {
        title: "Configure PostCSS",
        description:
          "Update your PostCSS configuration to use the new Tailwind CSS plugin:",
        code: `/* postcss.config.mjs */
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};`,
      },
    ],
  },
  utilities: {
    title: "Add Utilities",
    description: "Add helper functions and essential dependencies",
    steps: [
      {
        title: "Install dependencies",
        description:
          "Install lucide-react for icons and hls.js for video streaming support:",
        code: "npm install lucide-react hls.js",
      },
      {
        title: "Create a utility file",
        description:
          "Create a lib/utils.js file to store helper functions like clsx and tailwind-merge wrapper:",
        code: `import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}`,
      },
    ],
  },
  cli: {
    title: "CLI",
    description: "Use the Shadcn UI inspired CLI to add components",
    steps: [
      {
        title: "Initialize Shadcn UI",
        description: "Run the shadcn-ui init command to setup your project:",
        code: "npx shadcn@latest init",
      },
      {
        title: "Add components",
        description:
          "Use the add command to add individual components to your project:",
        code: `npx shadcn@latest add "https://fusionplayer.vercel.app/fusion-player.json" `,
      },
    ],
  },
};

const VALID_DOCS = {
  installation: ["nextjs", "tailwind", "utilities", "cli"],
};

function CodeBlock({ code }) {
  const parts = code.split(
    /(".*?"|'.*?'|`.*?`|\/\*[\s\S]*?\*\/|\/\/.*|@\w+|--\w+|(?:\b(?:npx|npm|cd|module\.exports|import|export|function|const|let|var|if|else|return|async|await|inline|oklch|What|Would|lucide-react|hls.js)\b))/g,
  );

  return (
    <div className="relative group mt-4">
      <pre className="bg-neutral-100 dark:bg-neutral-900  p-4 rounded-lg border border-border overflow-x-auto font-mono text-sm leading-relaxed">
        {parts.map((part, i) => {
          if (!part) return null;
          if (/^["'`].*["'`]$/.test(part))
            return (
              <span key={i} className="text-emerald-400">
                {part}
              </span>
            );
          if (/^(lucide-react|hls.js)$/.test(part))
            return (
              <span key={i} className="text-emerald-400">
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
          if (/^--/.test(part))
            return (
              <span key={i} className="text-sky-300">
                {part}
              </span>
            );
          if (/^(What|Would)$/.test(part))
            return (
              <span key={i} className="text-amber-400">
                {part}
              </span>
            );
          
          if (
            /^(npx|npm|cd|module\.exports|import|export|function|const|let|var|if|else|return|async|await|inline|oklch)$/.test(
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

function Step({ title, description, code, isLast }) {
  return (
    <div className="flex gap-6 ">
      <div className="flex flex-col items-center">
        <div className="w-px h-3 bg-border" />
        <div className="w-2.5 h-2.5 rounded-full bg-neutral-600 ring-4 ring-neutral-300 dark:ring-neutral-900" />
        {!isLast && <div className="w-px flex-1 bg-border" />}
      </div>
      <div className="pb-12 pt-0.5 w-full">
        <h3 className="text-xl font-semibold  mb-2">{title}</h3>
        <p className="text-neutral-500 mb-4">{description}</p>
        {code && <CodeBlock code={code} />}
      </div>
    </div>
  );
}

export default function DocPage({ params }) {
  const { section, slug } = use(params);

  if (!VALID_DOCS[section]?.includes(slug)) {
    notFound();
  }

  const content = DOCS_CONTENT[slug];

  if (!content) {
    return (
      <div>
        <h1 className="text-3xl font-bold capitalize mb-4">
          {slug?.replace("-", " ")}
        </h1>
        <p className="text-neutral-400">
          Content for this section is coming soon.
        </p>
      </div>
    );
  }

  return (
    <div className="w-4xl">
      <h1 className="text-4xl font-bold  mb-2">{content.title}</h1>
      <p className="text-lg text-neutral-500 mb-12">{content.description}</p>

      <div className="flex flex-col ">
        {content.steps.map((step, index) => (
          <Step
            key={index}
            {...step}
            isLast={index === content.steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
