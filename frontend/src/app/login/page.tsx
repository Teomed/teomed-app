'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Email ou senha inválidos');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      router.push('/dashboard');
    } catch (err) {
      setError('Email ou senha inválidos. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e3a8a] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[360px] flex flex-col items-center">
        <h2 className="text-2xl font-medium text-white mb-8">
          Formulário de login
        </h2>
        
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-white/90 mb-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                <span className="text-[15px]">Login</span>
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 text-white bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-white/50 transition-colors"
                required
                disabled={isLoading}
                autoComplete="email"
                autoFocus
              />
            </div>

            <div>
              <div className="flex items-center gap-2 text-white/90 mb-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-[15px]">Senha</span>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 text-white bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-white/50 transition-colors"
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-300 text-[13px] text-center mt-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-white text-[#1e3a8a] text-[15px] font-medium rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#1e3a8a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </span>
            ) : (
              'Acessar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
