const stack = [
  { name: "React", role: "Front-end UI library" },
  { name: "Tailwind CSS", role: "Utility-first styling" },
  { name: "Node.js", role: "JavaScript runtime" },
  { name: "Express", role: "Backend HTTP server" },
  { name: "Socket.IO", role: "Real-time messaging" },
  { name: "JWT", role: "Session authentication" },
];

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <span className="text-xs font-medium uppercase tracking-widest text-signal">
        About
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-mist sm:text-4xl">
        Built for conversations that can't wait.
      </h1>
      <p className="mt-6 text-base leading-relaxed text-mist-dim">
        Wavelength started as a simple idea: chat should feel instant.
        Every message you send travels over a persistent WebSocket
        connection straight to everyone else in the room, so there's no
        waiting, no polling, and no refreshing the page to see what people
        are saying.
      </p>
      <p className="mt-4 text-base leading-relaxed text-mist-dim">
        The project pairs a React and Tailwind CSS front end with a
        Node.js and Express back end. Socket.IO handles the real-time
        layer, while sign in and sign up are protected with hashed
        passwords and JSON Web Tokens.
      </p>

      <div className="mt-12">
        <h2 className="font-display text-xl font-semibold text-mist">
          What's under the hood
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {stack.map((item) => (
            <div key={item.name} className="card flex items-center gap-4 p-4">
              <span className="h-2 w-2 shrink-0 rounded-full bg-signal" />
              <div>
                <p className="font-medium text-mist">{item.name}</p>
                <p className="text-sm text-mist-dim">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 card p-6">
        <h2 className="font-display text-xl font-semibold text-mist">
          Our approach
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-mist-dim">
          We keep the interface calm and out of the way so the
          conversation stays the focus. Presence indicators and typing
          cues give just enough context to feel connected to the people
          you're talking to, without adding noise.
        </p>
      </div>
    </div>
  );
}
