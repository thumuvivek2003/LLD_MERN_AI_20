import { Gavel } from 'lucide-react';
import RegisterForm from '../components/RegisterForm.jsx';

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-indigo-700 via-brand-700 to-brand-500 p-12 text-white">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Gavel /> Auction MVP
        </div>
        <h1 className="mt-10 text-4xl font-bold">Join the auction floor</h1>
        <p className="mt-4 max-w-md text-white/80">
          Register as a bidder to participate, or as a spectator to watch live
          auctions unfold in real time.
        </p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-slate-800">Create account</h2>
          <p className="mt-1 text-sm text-slate-500">Choose your role to begin.</p>
          <div className="mt-8">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
