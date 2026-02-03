import Link from "next/link";

export default function DocsNotFound() {
  return (
    <div className="py-20">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="mt-2 text-neutral-400">
        This documentation page doesn’t exist.
      </p>

      <Link
        href="/docs"
        className="mt-4 inline-block text-blue-500 underline"
      >
        ← Back to docs
      </Link>
    </div>
  );
}
