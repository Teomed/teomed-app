'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/security.css';
import { Button, Container, Card } from '@/design-system2';

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
      <div className="security-page">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="security-page">
      <Container className="security-container">
        <div className="security-header">
          {!isRequired && (
            <Button onClick={() => router.push('/dashboard')} variant="textLink" size="small" className="back-button">
              ← Voltar
            </Button>
          )}
          <h1>Configurações de Segurança</h1>
          {isRequired && !mfaEnabled && (
            <div className="required-notice">
              ⚠️ Configuração obrigatória
            </div>
          )}
        </div>

        <Card className="security-card" hover={false}>
          <div className="card-header">
            <div>
              <h2>Autenticação em Dois Fatores (2FA)</h2>
              <p className="card-description">
                Adicione uma camada extra de segurança à sua conta
              </p>
            </div>
            <div className={`status-badge ${mfaEnabled ? 'enabled' : 'disabled'}`}>
              {mfaEnabled ? 'Ativado' : 'Desativado'}
            </div>
          </div>

          <div className="card-content">
            <p className="info-text">
              {mfaEnabled
                ? 'Sua conta está protegida com autenticação em dois fatores. Você precisará de um código do seu aplicativo autenticador para fazer login.'
                : 'Proteja sua conta com autenticação em dois fatores usando Google Authenticator, Microsoft Authenticator ou Authy.'}
            </p>

            {mfaEnabled && backupCodesCount > 0 && (
              <div className="backup-codes-info">
                <p>Códigos de backup restantes: {backupCodesCount}</p>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="card-actions">
              {!mfaEnabled ? (
                <Button
                  onClick={handleSetupMfa}
                  disabled={isLoading}
                  variant="primary"
                  size="small"
                >
                  Ativar Autenticação em Dois Fatores
                </Button>
              ) : (
                <Button
                  onClick={() => setShowDisableModal(true)}
                  variant="danger"
                  size="small"
                >
                  Desativar Autenticação em Dois Fatores
                </Button>
              )}
            </div>
          </div>
        </Card>
      </Container>

      {/* Modal de Configuração MFA */}
      {showSetupModal && (
        <div className="modal-overlay">
          <div className="modal-content-large">
            <div className="modal-header">
              <h3>Configurar Autenticação em Dois Fatores</h3>
              <button onClick={closeSetupModal} className="modal-close">✕</button>
            </div>

            <div className="modal-body">
              {!backupCodes.length ? (
                <>
                  <div className="setup-step">
                    <h4>1. Escaneie o QR Code</h4>
                    <p>Use Google Authenticator, Microsoft Authenticator ou Authy</p>
                    {qrCode && (
                      <div className="qr-code-container">
                        <img src={qrCode} alt="QR Code" />
                      </div>
                    )}
                  </div>

                  <div className="setup-step">
                    <h4>2. Ou digite o código manualmente</h4>
                    <div className="secret-code">
                      <code>{secret}</code>
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(secret);
                          setSuccess('Código copiado!');
                        }}
                        variant="secondary"
                        size="small"
                        className="btn-copy"
                      >
                        Copiar
                      </Button>
                    </div>
                  </div>

                  <div className="setup-step">
                    <h4>3. Digite o código de 6 dígitos</h4>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/\s/g, '').replace(/\D/g, '').slice(0, 6);
                        setVerificationCode(cleaned);
                        setError(''); // Limpar erro ao digitar
                      }}
                      placeholder="000000"
                      className={`code-input ${verificationCode.length === 6 ? 'code-complete' : ''}`}
                      maxLength={6}
                      autoComplete="off"
                    />
                    {verificationCode.length > 0 && verificationCode.length < 6 && (
                      <p className="code-hint">{6 - verificationCode.length} dígitos restantes</p>
                    )}
                  </div>

                  {error && <div className="error-message">{error}</div>}

                  <Button
                    onClick={handleConfirmMfa}
                    disabled={isLoading || verificationCode.length !== 6}
                    variant="primary"
                    size="small"
                    className="full-width"
                  >
                    {isLoading ? 'Verificando...' : 'Ativar'}
                  </Button>
                </>
              ) : (
                <>
                  <div className="success-message">
                    ✓ Autenticação em dois fatores ativada com sucesso!
                  </div>

                  <div className="backup-codes-section">
                    <h4>Códigos de Backup</h4>
                    <p className="warning-text">
                      ⚠️ Salve estes códigos em um local seguro. Você pode usá-los para acessar sua conta se perder acesso ao seu autenticador.
                    </p>
                    <div className="backup-codes-list">
                      {backupCodes.map((code, index) => (
                        <div key={index} className="backup-code">{code}</div>
                      ))}
                    </div>
                    <Button onClick={copyBackupCodes} variant="secondary" size="small" className="full-width">
                      Copiar Códigos
                    </Button>
                  </div>

                  <Button onClick={closeSetupModal} variant="primary" size="small" className="full-width">
                    Concluir
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Desativar MFA */}
      {showDisableModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Desativar Autenticação em Dois Fatores</h3>
              <button onClick={() => setShowDisableModal(false)} className="modal-close">✕</button>
            </div>

            <div className="modal-body">
              <p className="warning-text">
                ⚠️ Sua conta ficará menos segura. Digite sua senha para confirmar.
              </p>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="form-input"
              />

              {error && <div className="error-message">{error}</div>}

              <div className="modal-actions">
                <Button onClick={() => setShowDisableModal(false)} variant="secondary" size="small">
                  Cancelar
                </Button>
                <Button
                  onClick={handleDisableMfa}
                  disabled={isLoading || !password}
                  variant="danger"
                  size="small"
                >
                  {isLoading ? 'Desativando...' : 'Desativar'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
