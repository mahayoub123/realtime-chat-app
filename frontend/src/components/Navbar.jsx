import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();

  function linkClass({ isActive }) {
    return `text-sm font-medium transition hover:text-signal ${
      isActive ? "text-signal" : "text-mist-dim"
    }`;
  }

  function handleSignOut() {
    signOut();
    setOpen(false);
    navigate("/signin");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-signal" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-signal" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-mist">
            Wavelength
          </span>
        </NavLink>

        <div className="hidden items-center gap-8 md:flex">
          {publicLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <NavLink to="/chat" className={linkClass}>
              Chat Room
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-mist-dim">
                Hi, <span className="text-mist">{user?.username}</span>
              </span>
              <button onClick={handleSignOut} className="btn-secondary !px-4 !py-2 text-sm">
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/signin" className="btn-secondary !px-4 !py-2 text-sm">
                Sign in
              </NavLink>
              <NavLink to="/signup" className="btn-primary !px-4 !py-2 text-sm">
                Sign up
              </NavLink>
            </>
          )}
        </div>

        <button
          className="flex items-center justify-center rounded-lg border border-white/10 p-2 text-mist md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-ink px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-3">
            {publicLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <NavLink to="/chat" className={linkClass} onClick={() => setOpen(false)}>
                Chat Room
              </NavLink>
            )}
            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-mist-dim">
                    Signed in as <span className="text-mist">{user?.username}</span>
                  </span>
                  <button onClick={handleSignOut} className="btn-secondary w-full text-sm">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/signin"
                    className="btn-secondary w-full text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Sign in
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="btn-primary w-full text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Sign up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
