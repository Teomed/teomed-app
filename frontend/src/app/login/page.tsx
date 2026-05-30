'use client';

import { useState } from 'react';
import { Button, Container, Card } from '@/design-system';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [showBackupCode, setShowBackupCode] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !validateEmail(value)) {
      setEmailError('Por favor, insira um e-mail válido');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    
    // Validar email antes de enviar
    if (!validateEmail(email)) {
      setEmailError('Por favor, insira um e-mail válido');
      return;
    }
    
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
      console.log('🔍 DEBUG: API URL being used:', apiUrl); // Debug line to verify env var
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Email ou senha inválidos');
      }

      const data = await response.json();
      
      // Verificar se requer setup MFA obrigatório
      if (data.requiresMfaSetup) {
        localStorage.setItem('token', data.setupToken);
        window.location.href = '/settings/security?setup=required';
        return;
      }
      
      // Verificar se requer MFA
      if (data.requires2FA) {
        setRequires2FA(true);
        setTempToken(data.tempToken);
        sessionStorage.setItem('mfa_temp_token', data.tempToken);
        setIsLoading(false);
        return;
      }
      
      localStorage.setItem('token', data.access_token);
      // Usar replace em vez de push para evitar problemas de navegação
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Email ou senha inválidos. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyMfa = async () => {
    if (mfaCode.length !== 6 && mfaCode.length !== 8) {
      setError('Código inválido');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const storedTempToken = sessionStorage.getItem('mfa_temp_token') || '';
      const tokenToUse = tempToken || storedTempToken;
      if (!tokenToUse) {
        throw new Error('Sessão de autenticação expirada. Faça login novamente.');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
      const response = await fetch(`${apiUrl}/auth/verify-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tempToken: tokenToUse,
          token: mfaCode,
          isBackupCode: showBackupCode,
        }),
      });

      if (!response.ok) {
        let message = 'Falha ao verificar código';
        try {
          const errorData = await response.json();
          const raw = errorData?.message;
          if (Array.isArray(raw)) {
            message = raw.join(', ');
          } else if (typeof raw === 'string' && raw.trim().length > 0) {
            message = raw;
          }
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      sessionStorage.removeItem('mfa_temp_token');
      window.location.href = '/dashboard';
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao verificar código';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-page flex items-center justify-center py-10">
      <Container className="w-full">
        <div className="mx-auto w-full max-w-[420px]">
          <Card hover={false} padding="md" className="animate-fade-in">
            <div className="text-center">
              <h1 className="text-text-primary text-2xl font-semibold">Bem-vindo</h1>
              <p className="mt-1 text-sm text-text-muted">Faça login para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-medium text-text-label">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>E-mail</span>
                </div>
                <input
                  type="email"
                  placeholder="Digite seu e-mail"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full rounded-md border bg-surface-white px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus-ring ${emailError ? 'border-semantic-error' : 'border-neutral-border'}`}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                  autoFocus
                />
                {emailError && <span className="text-xs text-semantic-error">{emailError}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-medium text-text-label">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Senha</span>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-neutral-border bg-surface-white px-4 py-3 pr-12 text-sm text-text-primary placeholder:text-text-muted focus-ring"
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-text-muted hover:text-text-primary focus-ring"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? (
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-text-muted">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-neutral-border accent-brand-600 focus-ring"
                  />
                  Lembrar-me
                </label>
                <a
                  href="#"
                  className="text-brand-600 hover:text-brand-700 underline-offset-2 hover:underline"
                >
                  Esqueceu a senha?
                </a>
              </div>

              {error && (
                <div className="rounded-md border border-semantic-error bg-surface-white px-3 py-2 text-center text-xs text-semantic-error">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                loading={isLoading}
                variant="primary"
                size="sm"
                className="w-full justify-center"
              >
                LOGIN
              </Button>
            </form>
          </Card>
        </div>
      </Container>

      {/* Modal MFA */}
      {requires2FA && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-[400px]">
            <Card hover={false} padding="md">
              <div className="text-center">
                <h2 className="text-text-primary text-xl font-semibold">Autenticação em Dois Fatores</h2>
                <p className="mt-2 text-sm text-text-muted">
                  Digite o código de 6 dígitos do seu aplicativo autenticador
                </p>
              </div>

              <div className="mt-6">
                <input
                  type="text"
                  value={mfaCode}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (showBackupCode) {
                      const cleaned = raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8);
                      setMfaCode(cleaned);
                    } else {
                      const cleaned = raw.replace(/\D/g, '').slice(0, 6);
                      setMfaCode(cleaned);
                    }
                  }}
                  placeholder={showBackupCode ? '00000000' : '000000'}
                  className="w-full rounded-md border border-neutral-border bg-surface-white px-4 py-3 text-center font-mono text-2xl tracking-[0.5rem] text-text-primary placeholder:text-text-muted focus-ring"
                  maxLength={showBackupCode ? 8 : 6}
                  autoFocus
                />
              </div>

              {error && (
                <div className="mt-4 rounded-md border border-semantic-error bg-surface-white px-3 py-2 text-center text-xs text-semantic-error">
                  {error}
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3">
                <Button
                  onClick={handleVerifyMfa}
                  disabled={isLoading || (showBackupCode ? mfaCode.length !== 8 : mfaCode.length !== 6)}
                  loading={isLoading}
                  variant="primary"
                  size="sm"
                  className="w-full justify-center"
                >
                  Verificar
                </Button>

                <Button
                  onClick={() => {
                    setShowBackupCode(!showBackupCode);
                    setMfaCode('');
                    setError('');
                  }}
                  variant="secondary"
                  size="sm"
                  className="w-full justify-center"
                >
                  {showBackupCode ? 'Usar código do autenticador' : 'Usar código de backup'}
                </Button>

                <Button
                  onClick={() => {
                    setRequires2FA(false);
                    setTempToken('');
                    setMfaCode('');
                    setShowBackupCode(false);
                    setError('');
                    sessionStorage.removeItem('mfa_temp_token');
                  }}
                  variant="textLink"
                  size="sm"
                  className="w-full justify-center"
                >
                  Cancelar
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
