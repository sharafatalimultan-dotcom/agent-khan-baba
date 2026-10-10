import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1>Page not found</h1>
      <p className="mt-3 text-ink-soft">The page you are looking for does not exist.</p>
      <Link href="/" className="btn-primary mt-6 !w-auto">Back to home</Link>
    </div>
  );
}
