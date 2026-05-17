import { Gavel } from 'lucide-react';
import LoginForm from '../components/LoginForm.jsx';

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-600 p-12 text-white">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Gavel /> Auction MVP
        </div>
        <h1 className="mt-10 text-4xl font-bold leading-tight">
          Bid live. Win smart.
        </h1>
        <p className="mt-4 max-w-md text-white/80">
          A concurrency-safe auction platform built to learn state machines,
          event-driven design, and real-time systems.
        </p>
        <ul className="mt-8 space-y-2 text-sm text-white/80">
          <li>• Real-time highest-bid updates over WebSocket</li>
          <li>• Strategy &amp; chain-of-responsibility validation</li>
          <li>• Optimistic locking for bid races</li>
        </ul>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-slate-800">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to manage or join an auction.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
          <div className="mt-8 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
            <p className="font-medium text-slate-600">Demo accounts</p>
            <p>admin@auction.com / Admin@123</p>
            <p>alice@auction.com / Member@123</p>
            <p>eve@auction.com / Specta@123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
