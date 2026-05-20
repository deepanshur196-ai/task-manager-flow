import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-100 via-slate-100 to-purple-200">
      <div className="landing-blob landing-blob-1" />
      <div className="landing-blob landing-blob-2" />
      <div className="landing-blob landing-blob-3" />

      <div className="relative z-10 mx-auto flex min-h-screen items-center px-6 py-24">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[1.25fr_0.85fr] items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-soft animate-fade-in">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
                Built for fast-moving teams
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                  Ethara makes teamwork feel effortless.
                </h1>
                <p className="max-w-xl text-lg leading-8 text-slate-700">
                  Smart task planning, real-time collaboration, and beautiful analytics all in one workspace — designed to keep your team aligned and productive.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-accent-500 px-8 py-3 text-base font-semibold text-white shadow-soft-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-xl focus:outline-none focus:ring-4 focus:ring-primary-200"
                >
                  Get started
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-3 text-base font-semibold text-slate-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50"
                >
                  Login
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="card bg-white/90 shadow-soft-lg p-5 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-2">
                  <div className="text-2xl">🚀</div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">Launch faster</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Create projects, assign tasks, and start collaborating in seconds with no setup overhead.
                  </p>
                </div>
                <div className="card bg-white/90 shadow-soft-lg p-5 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-2">
                  <div className="text-2xl">🔔</div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">Stay notified</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Get instant alerts for meetings, deadlines, and task updates so nothing slips through the cracks.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white/90 p-8 shadow-soft-xl backdrop-blur-xl ring-1 ring-slate-200 transition duration-500 hover:-translate-y-2 hover:scale-[1.02]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Interactive preview</p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900">Live workspace overview</h2>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">New</span>
              </div>

              <div className="mt-8 space-y-5">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:border-blue-200 hover:bg-white">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-900">Daily standups</span>
                    <span className="rounded-full bg-primary-100 px-3 py-1 text-xs text-primary-700">Team</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">Visual progress boards, agenda edit, and reminders in one place.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:border-blue-200 hover:bg-white">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-900">Event timeline</span>
                    <span className="rounded-full bg-accent-100 px-3 py-1 text-xs text-accent-700">Meetings</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">Track meetings and reminders with animated notification cues.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
