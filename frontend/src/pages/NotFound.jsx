import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <span className="font-display text-6xl font-semibold text-signal">404</span>
      <h1 className="mt-4 font-display text-2xl font-semibold text-mist">
        Signal lost
      </h1>
      <p className="mt-2 text-sm text-mist-dim">
        We couldn't find the page you were looking for.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
