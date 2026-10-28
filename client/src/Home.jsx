// import React from 'react'
// import { Link } from 'react-router-dom'
// const Home = () => {
//     return (
     
//             <div className='min-h-screen flex flex-col justify-center items-center'>
               
//                 <h1 className='text-6xl mb-4 font-sans'>Welcome to Tiny URL🔗</h1>
//                 <p className='text-3xl mb-4 font-sans'>Convert the large URL into short</p>
//                 <Link to='/app' className='bg-orange-500 font-sans shadow-lg px-3 py-2 text-2xl text-white rounded hover:bg-orange-700'>Let's Search</Link>
//             </div>
            
     
        
        
//     )
// }

// export default Home



import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fffaf5] text-slate-900">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="pointer-events-none absolute left-0 top-[30rem] h-72 w-72 rounded-full bg-amber-100/60 blur-3xl" />

      {/* Navbar */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/25">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
            >
              <path
                d="M10 13.5L14 9.5M8 17H6a4 4 0 010-8h4m4 0h2a4 4 0 010 8h-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-2xl font-extrabold tracking-tight">
            Tiny<span className="text-orange-500">URL</span>
          </span>
        </Link>

        <Link
          to="/app"
          className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
        >
          Open Dashboard <span className="ml-1">↗</span>
        </Link>
      </nav>

      {/* Hero */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-12 lg:px-10 lg:pt-20">
        <section className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left content */}
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              <span className="text-sm font-semibold text-orange-700">
                Short links. Big possibilities.
              </span>
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
              Long URLs?
              <br />
              Make them
              <br />
              <span className="relative inline-block text-orange-500">
                tiny & powerful.
                <svg
                  viewBox="0 0 320 12"
                  className="absolute -bottom-2 left-0 w-full"
                  fill="none"
                >
                  <path
                    d="M4 7C85 2 220 2 315 7"
                    stroke="#fdba74"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-8 text-slate-600 sm:text-xl">
              Turn long, messy links into short, shareable URLs.
              Keep your links organized and track their clicks, all
              in one simple workspace.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/app"
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-orange-500 px-7 py-4 font-bold text-white shadow-xl shadow-orange-500/25 transition hover:-translate-y-1 hover:bg-orange-600"
              >
                Shorten a URL
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 transition group-hover:translate-x-1"
                >
                  <path
                    d="M5 12h14m-6-6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-7 py-4 font-bold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
              >
                Explore features
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs text-green-700">
                  ✓
                </span>
                Easy to use
              </span>
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs text-green-700">
                  ✓
                </span>
                Track your clicks
              </span>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -right-4 -top-5 h-24 w-24 rounded-3xl bg-orange-200/70 rotate-12" />
            <div className="absolute -bottom-5 -left-4 h-24 w-24 rounded-3xl bg-amber-200/70 -rotate-12" />

            <div className="relative rounded-[2rem] border border-white bg-white/90 p-5 shadow-2xl shadow-orange-900/10 backdrop-blur sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    YOUR LINK WORKSPACE
                  </p>
                  <h2 className="mt-1 text-xl font-extrabold">
                    Link overview
                  </h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
                  🔗
                </div>
              </div>

              {/* Example long URL */}
              <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Original link
                </p>
                <p className="break-all text-sm leading-6 text-slate-600">
                  https://example.com/blog/how-to-grow-your-business-online
                </p>
              </div>

              <div className="my-3 flex justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-100 bg-orange-50 text-xl text-orange-500">
                  ↓
                </div>
              </div>

              {/* Example short URL */}
              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-orange-600">
                  Your tiny link
                </p>
                <div className="flex items-center justify-between gap-3">
                  <span className="break-all font-bold text-orange-700">
                    tinyurl.example/Ab12Cd
                  </span>
                  <span className="shrink-0 rounded-xl bg-orange-500 px-3 py-2 text-xs font-bold text-white">
                    Ready!
                  </span>
                </div>
              </div>

              {/* Decorative statistics preview */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="text-lg">⚡</span>
                    Quick sharing
                  </div>
                  <p className="mt-2 font-bold text-slate-800">
                    One tiny link
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="text-lg">📊</span>
                    Link insights
                  </div>
                  <p className="mt-2 font-bold text-slate-800">
                    Click tracking
                  </p>
                </div>
              </div>

              <p className="mt-5 text-center text-xs text-slate-400">
                A simpler way to share what matters.
              </p>
            </div>

            {/* Floating badge */}
            <div className="absolute -right-2 top-24 hidden items-center gap-3 rounded-2xl border border-orange-100 bg-white p-3 shadow-xl sm:flex sm:-right-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-xl">
                ✓
              </span>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Link simplified
                </p>
                <p className="text-xs text-slate-500">
                  Ready to share
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mt-28 scroll-mt-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
              Made for simplicity
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Everything your links need.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Less clutter, easier sharing, and a clear view of your links.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon="✂️"
              title="Shorten instantly"
              description="Turn long URLs into compact links that are easy to share anywhere."
            />
            <FeatureCard
              icon="📈"
              title="Track engagement"
              description="See click counts and overall link statistics from your dashboard."
            />
            <FeatureCard
              icon="🗂️"
              title="Stay organized"
              description="View your shortened links, copy them quickly, and remove links you no longer need."
            />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative mt-24 overflow-hidden rounded-[2rem] bg-slate-900 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-orange-400/10 blur-3xl" />

          <div className="relative">
            <p className="font-semibold text-orange-400">
              Ready when you are
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-black text-white sm:text-5xl">
              Your next great link starts here.
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-300">
              Keep it short. Make it memorable. Start sharing with TinyURL.
            </p>
            <Link
              to="/app"
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-orange-500 px-7 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-orange-400"
            >
              Get started for free
              <span className="text-lg">→</span>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-orange-100 pt-7 text-sm text-slate-500 sm:flex-row">
          <Link to="/" className="font-extrabold text-slate-800">
            Tiny<span className="text-orange-500">URL</span>
          </Link>
          <p>Make every link count. © {new Date().getFullYear()} TinyURL</p>
          <Link
            to="/app"
            className="font-semibold transition hover:text-orange-500"
          >
            Open dashboard →
          </Link>
        </footer>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <article className="group rounded-3xl border border-orange-100/80 bg-white/80 p-7 transition duration-300 hover:-translate-y-2 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-900/5">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl transition group-hover:bg-orange-500 group-hover:scale-105">
      {icon}
    </div>
    <h3 className="mt-6 text-xl font-extrabold">{title}</h3>
    <p className="mt-3 leading-7 text-slate-600">{description}</p>
  </article>
);

export default Home;
