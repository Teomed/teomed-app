'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/security.css';
import { Button, Container, Card } from '@/design-system';

export default function SecuritySettings() {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [backupCodesCount, setBackupCodesCount] = useState(0);
  const [isRequired, setIsRequired] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar se setup é obrigatório
    const params = new URLSearchParams(window.location.search);
    if (params.get('setup') === 'required') {
      setIsRequired(true);
    }
    checkMfaStatus();
  }, []);

  const checkMfaStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
      const response = await fetch(`${apiUrl}/auth/2fa-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setMfaEnabled(data.enabled);
        setBackupCodesCount(data.backupCodesCount);

        // Se setup era obrigatório mas já está habilitado, sair do fluxo
        const params = new URLSearchParams(window.location.search);
        if (params.get('setup') === 'required' && data.enabled) {
          router.push('/dashboard');
          return;
        }

        // Se setup é obrigatório e ainda não está habilitado, iniciar setup
        if (params.get('setup') === 'required' && !data.enabled) {
          await handleSetupMfa();
          return;
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status MFA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupMfa = async () => {
    setError('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';

      if (!token) {
        router.push('/login');
        return;
      }
      
      const response = await fetch(`${apiUrl}/auth/setup-2fa`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }

        let message = 'Erro ao configurar autenticação em dois fatores';
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
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setShowSetupModal(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao configurar autenticação em dois fatores';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmMfa = async () => {
    if (verificationCode.length !== 6) {
      setError('Código deve ter 6 dígitos');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
      
      const response = await fetch(`${apiUrl}/auth/confirm-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token: verificationCode }),
      });

      if (!response.ok) {
        throw new Error('Código inválido');
      }

      const data = await response.json();
      setBackupCodes(data.backupCodes);
      setMfaEnabled(true);
      setSuccess('Autenticação em dois fatores ativada com sucesso!');
      setVerificationCode('');

      // Se backend devolveu token definitivo, salvar e sair do fluxo obrigatório
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      }
    } catch (error) {
      setError('Código inválido. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableMfa = async () => {
    if (!password) {
      setError('Digite sua senha para desativar MFA');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
      
      const response = await fetch(`${apiUrl}/auth/disable-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error('Senha incorreta');
      }

      setMfaEnabled(false);
      setShowDisableModal(false);
      setPassword('');
      setSuccess('Autenticação em dois fatores desativada');
    } catch (error) {
      setError('Senha incorreta');
    } finally {
      setIsLoading(false);
    }
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setSuccess('Códigos de backup copiados!');
  };

  const closeSetupModal = () => {
    setShowSetupModal(false);
    setQrCode('');
    setSecret('');
    setVerificationCode('');
    setBackupCodes([]);
    setError('');
    setSuccess('');
    
    // Se era obrigatório, redirecionar para dashboard com aviso
    if (isRequired && !mfaEnabled) {
      router.push('/dashboard?mfa_pending=true');
    } else if (isRequired && mfaEnabled) {
      router.push('/dashboard');
    }
  };

  if (isLoading && !showSetupModal) {
    return (
      <div className="min-h-screen bg-surface-light flex items-center justify-center p-6">
        <div className="text-sm text-text-muted">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-light py-10">
      <Container className="w-full">
        <div className="mx-auto w-full max-w-[800px]">
          <div className="mb-8 flex flex-col gap-4">
            {!isRequired && (
              <div>
                <Button
                  onClick={() => router.push('/dashboard')}
                  variant="textLink"
                  size="small"
                >
                  ← Voltar
                </Button>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-semibold text-text-primary">Configurações de Segurança</h1>
              {isRequired && !mfaEnabled && (
                <div className="rounded-lg border border-semantic-warning bg-surface-white px-4 py-3 text-sm text-text-primary">
                  ⚠️ Configuração obrigatória
                </div>
              )}
            </div>
          </div>

          <Card hover={false} padding="md" className="animate-fade-in">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Autenticação em Dois Fatores (2FA)</h2>
                  <p className="mt-2 text-sm text-text-muted">
                    Adicione uma camada extra de segurança à sua conta
                  </p>
                </div>

                <div
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    mfaEnabled
                      ? 'bg-semantic-success text-surface-white'
                      : 'bg-semantic-error text-surface-white'
                  }`}
                >
                  {mfaEnabled ? 'Ativado' : 'Desativado'}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-sm leading-relaxed text-text-secondary">
                  {mfaEnabled
                    ? 'Sua conta está protegida com autenticação em dois fatores. Você precisará de um código do seu aplicativo autenticador para fazer login.'
                    : 'Proteja sua conta com autenticação em dois fatores usando Google Authenticator, Microsoft Authenticator ou Authy.'}
                </p>

                {mfaEnabled && backupCodesCount > 0 && (
                  <div className="rounded-lg border border-neutral-border bg-surface-white px-4 py-3 text-sm text-text-secondary">
                    Códigos de backup restantes: <span className="font-semibold text-text-primary">{backupCodesCount}</span>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg border border-semantic-error bg-surface-white px-4 py-3 text-sm text-semantic-error">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="rounded-lg border border-semantic-success bg-surface-white px-4 py-3 text-sm text-semantic-success">
                    {success}
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  {!mfaEnabled ? (
                    <Button onClick={handleSetupMfa} disabled={isLoading} variant="primary" size="sm">
                      Ativar Autenticação em Dois Fatores
                    </Button>
                  ) : (
                    <Button onClick={() => setShowDisableModal(true)} variant="danger" size="sm">
                      Desativar Autenticação em Dois Fatores
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>

      {/* Modal de Configuração MFA */}
      {showSetupModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-[600px]">
            <Card hover={false} padding="md" className="max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-text-primary">Configurar Autenticação em Dois Fatores</h3>
                <button
                  type="button"
                  onClick={closeSetupModal}
                  className="rounded-full p-2 text-text-muted hover:text-text-primary focus-ring"
                  aria-label="Fechar"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 max-h-[70vh] overflow-y-auto pr-1">
                {!backupCodes.length ? (
                  <div className="flex flex-col gap-8">
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary">1. Escaneie o QR Code</h4>
                      <p className="mt-2 text-sm text-text-muted">Use Google Authenticator, Microsoft Authenticator ou Authy</p>
                      {qrCode && (
                        <div className="mt-4 flex justify-center rounded-lg border border-neutral-border bg-surface-light p-6">
                          <img src={qrCode} alt="QR Code" className="h-auto w-full max-w-[256px]" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-text-primary">2. Ou digite o código manualmente</h4>
                      <div className="mt-3 flex flex-col gap-3 rounded-lg border border-neutral-border bg-surface-light p-4 sm:flex-row sm:items-center sm:justify-between">
                        <code className="break-all font-mono text-sm text-text-primary">{secret}</code>
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(secret);
                            setSuccess('Código copiado!');
                          }}
                          variant="secondary"
                          size="sm"
                        >
                          Copiar
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-text-primary">3. Digite o código de 6 dígitos</h4>
                      <div className="mt-3">
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(/\s/g, '').replace(/\D/g, '').slice(0, 6);
                            setVerificationCode(cleaned);
                            setError('');
                          }}
                          placeholder="000000"
                          className={`w-full rounded-md border bg-surface-white px-4 py-3 text-center font-mono text-2xl tracking-[0.5rem] text-text-primary placeholder:text-text-muted focus-ring ${
                            verificationCode.length === 6 ? 'border-semantic-success' : 'border-neutral-border'
                          }`}
                          maxLength={6}
                          autoComplete="off"
                        />
                        {verificationCode.length > 0 && verificationCode.length < 6 && (
                          <p className="mt-2 text-center text-xs text-text-muted">
                            {6 - verificationCode.length} dígitos restantes
                          </p>
                        )}
                      </div>
                    </div>

                    {error && (
                      <div className="rounded-lg border border-semantic-error bg-surface-white px-4 py-3 text-sm text-semantic-error">
                        {error}
                      </div>
                    )}

                    <Button
                      onClick={handleConfirmMfa}
                      disabled={isLoading || verificationCode.length !== 6}
                      variant="primary"
                      size="sm"
                      className="w-full justify-center"
                    >
                      {isLoading ? 'Verificando...' : 'Ativar'}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    <div className="rounded-lg border border-semantic-success bg-surface-white px-4 py-3 text-sm text-semantic-success">
                      ✓ Autenticação em dois fatores ativada com sucesso!
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-text-primary">Códigos de Backup</h4>
                      <p className="mt-2 rounded-lg border border-semantic-warning bg-surface-light px-4 py-3 text-sm text-text-primary">
                        ⚠️ Salve estes códigos em um local seguro. Você pode usá-los para acessar sua conta se perder acesso ao seu autenticador.
                      </p>

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {backupCodes.map((code, index) => (
                          <div
                            key={index}
                            className="rounded-lg border border-neutral-border bg-surface-white px-4 py-3 text-center font-mono text-sm text-text-primary"
                          >
                            {code}
                          </div>
                        ))}
                      </div>

                      <div className="mt-4">
                        <Button onClick={copyBackupCodes} variant="secondary" size="sm" className="w-full justify-center">
                          Copiar Códigos
                        </Button>
                      </div>
                    </div>

                    <Button onClick={closeSetupModal} variant="primary" size="sm" className="w-full justify-center">
                      Concluir
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Modal de Desativar MFA */}
      {showDisableModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-[500px]">
            <Card hover={false} padding="md">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-text-primary">Desativar Autenticação em Dois Fatores</h3>
                <button
                  type="button"
                  onClick={() => setShowDisableModal(false)}
                  className="rounded-full p-2 text-text-muted hover:text-text-primary focus-ring"
                  aria-label="Fechar"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6">
                <p className="rounded-lg border border-semantic-warning bg-surface-light px-4 py-3 text-sm text-text-primary">
                  ⚠️ Sua conta ficará menos segura. Digite sua senha para confirmar.
                </p>

                <div className="mt-4">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="w-full rounded-md border border-neutral-border bg-surface-white px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus-ring"
                  />
                </div>

                {error && (
                  <div className="mt-4 rounded-lg border border-semantic-error bg-surface-white px-4 py-3 text-sm text-semantic-error">
                    {error}
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button onClick={() => setShowDisableModal(false)} variant="secondary" size="sm">
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleDisableMfa}
                    disabled={isLoading || !password}
                    variant="danger"
                    size="sm"
                  >
                    {isLoading ? 'Desativando...' : 'Desativar'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
