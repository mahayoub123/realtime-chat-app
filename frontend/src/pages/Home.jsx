import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const previewMessages = [
  { user: "Amara", text: "Deploying the new build now 🚀", self: false },
  { user: "You", text: "Nice, I'll watch the logs.", self: true },
  { user: "Diego", text: "Green across the board ✅", self: false },
];

const features = [
  {
    title: "Instant delivery",
    desc: "Messages arrive the moment they're sent, powered by Socket.IO under the hood.",
  },
  {
    title: "Live presence",
    desc: "See exactly who is in the room right now, with typing indicators as they write.",
  },
  {
    title: "Multiple rooms",
    desc: "Jump between General, Random, and Tech Talk without losing the thread.",
  },
  {
    title: "Secure by default",
    desc: "Accounts are protected with hashed passwords and signed JWT sessions.",
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-fadeInUp">
            <span className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3 py-1 text-xs font-medium text-signal">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              Live right now
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-mist sm:text-5xl">
              Conversation, on the same wavelength.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-mist-dim sm:text-lg">
              Wavelength is a real-time chat room for teams and friends.
              Sign up, pick a room, and watch messages land instantly —
              no refresh, no delay.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to={isAuthenticated ? "/chat" : "/signup"} className="btn-primary">
                {isAuthenticated ? "Enter chat room" : "Get started free"}
              </Link>
              <Link to="/about" className="btn-secondary">
                Learn more
              </Link>
            </div>
          </div>

          {/* Live chat preview mockup */}
          <div className="card animate-fadeInUp p-4 shadow-2xl shadow-black/40 sm:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-signal" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-signal" />
                </span>
                <span className="text-sm font-medium text-mist">#general</span>
              </div>
              <span className="text-xs text-mist-dim">3 online</span>
            </div>
            <div className="mt-4 space-y-3">
              {previewMessages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.self ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                      m.self
                        ? "bg-signal text-ink"
                        : "bg-white/5 text-mist"
                    }`}
                  >
                    {!m.self && (
                      <p className="mb-0.5 text-xs font-semibold text-signal">
                        {m.user}
                      </p>
                    )}
                    <p>{m.text}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-1 pl-1 text-xs text-mist-dim">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-mist-dim [animation-delay:-0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-mist-dim [animation-delay:-0.1s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-mist-dim" />
                <span className="ml-1">Diego is typing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/10 bg-ink-light/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-mist sm:text-3xl">
            Everything a live conversation needs
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="card p-6">
                <div className="h-8 w-8 rounded-lg bg-signal/10" />
                <h3 className="mt-4 font-display text-base font-semibold text-mist">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-dim">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
