import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // This demo form doesn't call an API endpoint yet — wire it up to a
    // /api/contact route on the backend if you want to persist messages.
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <span className="text-xs font-medium uppercase tracking-widest text-signal">
        Contact
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-mist sm:text-4xl">
        Send us a message
      </h1>
      <p className="mt-4 text-base leading-relaxed text-mist-dim">
        Questions, feedback, or bug reports — we'd like to hear them.
        Fill out the form and we'll get back to you.
      </p>

      <div className="mt-10 card p-6 sm:p-8">
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal/10 text-signal">
              ✓
            </span>
            <h2 className="font-display text-lg font-semibold text-mist">
              Message sent
            </h2>
            <p className="text-sm text-mist-dim">
              Thanks, {form.name || "friend"} — we'll be in touch soon.
            </p>
            <button
              onClick={() => {
                setForm({ name: "", email: "", message: "" });
                setSubmitted(false);
              }}
              className="btn-secondary mt-2 text-sm"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-mist">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jordan Lee"
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-mist">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-mist">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={form.message}
                onChange={handleChange}
                placeholder="How can we help?"
                className="input-field resize-none"
              />
            </div>
            <button type="submit" className="btn-primary w-full sm:w-auto">
              Send message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
