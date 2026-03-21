import { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Boards</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === 'login' ? 'Sign in to continue' : 'Create your account'}
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <div className="flex mb-6 border-b">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${
                mode === 'login' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${
                mode === 'register' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'
              }`}
            >
              Register
            </button>
          </div>

          {mode === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Demo: admin@jira.dev / admin
        </p>
      </div>
    </div>
  );
}
