import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-neutral-400">
        The page you’re looking for doesn’t exist.
      </p>

      <Link
        href="/"
        className="rounded-md bg-white px-4 py-2 text-black"
      >
        Go home
      </Link>
    </div>
  );
}
