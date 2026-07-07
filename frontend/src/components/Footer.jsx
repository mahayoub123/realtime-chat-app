import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-signal" />
              <span className="font-display text-lg font-semibold text-mist">
                Wavelength
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-mist-dim">
              A live signal for your team and friends. Messages travel the
              instant you send them, no refresh required.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-mist">Navigate</h3>
              <ul className="mt-3 space-y-2 text-sm text-mist-dim">
                <li><Link to="/" className="transition hover:text-signal">Home</Link></li>
                <li><Link to="/about" className="transition hover:text-signal">About</Link></li>
                <li><Link to="/contact" className="transition hover:text-signal">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-mist">Account</h3>
              <ul className="mt-3 space-y-2 text-sm text-mist-dim">
                <li><Link to="/signin" className="transition hover:text-signal">Sign in</Link></li>
                <li><Link to="/signup" className="transition hover:text-signal">Sign up</Link></li>
                <li><Link to="/chat" className="transition hover:text-signal">Chat room</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-mist-dim sm:flex-row">
          <p>© 2026 Wavelength.  Developed by:Full -Stack Web Developer Eng: Mahmoud Ayoub All rights reserved.</p>

        </div>
      </div>
    </footer>
  );
}
