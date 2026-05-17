import RegisterForm from '../components/RegisterForm.jsx';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-2xl font-bold">
            <span className="h-10 w-10 rounded-2xl bg-brand text-white flex items-center justify-center">S</span>
            <span>ShopKart</span>
          </div>
          <p className="text-sm text-slate-500 mt-2">Create your shopping account.</p>
        </div>
        <div className="card">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
