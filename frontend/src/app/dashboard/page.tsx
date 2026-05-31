'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ReactElement, JSX } from 'react';
import { Application } from './types';
import { Button, Card, Container, Section } from '@/design-system';

export default function Dashboard(): ReactElement {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const [showMfaBanner, setShowMfaBanner] = useState(false);
  const router = useRouter();

  const getAppOverride = (name: string) => {
    const n = (name || '').trim().toLowerCase();

    if (n === 'teomed viewer') {
      return {
        name: 'Teomed-Filemaker',
        description:
          'Prontuário médico completo: história clínica, exame físico, exames pré e pós-operatórios, evoluções, receitas, atestados e anexos.',
      };
    }

    if (n === 'patientflow manager' || n === 'patient flow manager') {
      return {
        name: 'Consultas Novas',
        description:
          'Controle de pacientes que passam pela consulta e seu seguimento, inclusive no pós-operatório e após a cirurgia.',
      };
    }

    if (n === 'lab results analyzer' || n === 'lab results analyser') {
      return {
        name: 'Financeiro',
        description:
          'Gestão financeira do consultório: receitas de consultas e cirurgias, pagamentos da equipe e controle de despesas e gastos.',
      };
    }

    if (n === 'medchart mobile' || n === 'medchat mobile') {
      return {
        name: 'Consultas-Google',
        description:
          'Captura consultas do Google Agenda e cria um banco de dados com análise de ganhos, produtividade e evolução do faturamento.',
      };
    }

    if (n === 'prescription generator') {
      return {
        name: 'Faxina',
        description:
          'Pagamento e controle da faxineira: dias trabalhados, recibos, valores e relatórios do trabalho efetuado.',
      };
    }

    if (n === 'surgical planner 3d') {
      return {
        name: 'Faxina Casa',
        description:
          'Pagamento e controle da faxina da casa do Dr. José Luis: dias, recibos, valores e relatórios do trabalho efetuado.',
      };
    }

    return null;
  };

  const decodeToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Verificar se MFA está pendente
    const params = new URLSearchParams(window.location.search);
    if (params.get('mfa_pending') === 'true') {
      setShowMfaBanner(true);
    }

    // Decodificar token para obter email do usuário
    const decoded = decodeToken(token);
    if (decoded && decoded.email) {
      setUserEmail(decoded.email);
    }

    fetchApplications(token);
    checkMfaStatus(token);
  }, [router]);

  const checkMfaStatus = async (token: string) => {
    try {
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
        // Se MFA não estiver ativo, redirecionar para setup obrigatório
        if (!data.enabled) {
          router.push('/settings/security?setup=required');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status MFA:', error);
    }
  };

  const fetchApplications = async (token: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
      console.log('🔍 DEBUG: API URL being used:', apiUrl); // Debug line to verify env var
      const response = await fetch(`${apiUrl}/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token inválido, redirecionar para login
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        throw new Error('Falha ao carregar aplicações');
      }

      const data = await response.json();
      // Mapear os dados do backend para o formato esperado pelo frontend
      const mappedApplications = data.map((app: any) => ({
        id: app._id,
        name: (() => {
          const override = getAppOverride(app.name);
          return override?.name || app.name;
        })(),
        description: (() => {
          const override = getAppOverride(app.name);
          return override?.description || app.description || 'Sem descrição';
        })(),
        status: 'active', // Backend não tem status, assumir ativo
        createdAt: app.uploadedAt || app.createdAt || new Date().toISOString(),
        url:
          typeof app.downloadUrl === 'string' &&
          app.downloadUrl.length > 0 &&
          !app.downloadUrl.includes('download.example.com')
            ? app.downloadUrl
            : undefined,
      }));
      setApplications(mappedApplications);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-light text-text-primary flex items-center justify-center p-6">
        <svg className="h-6 w-6 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-light text-text-primary">
      <header className="border-b border-white/15 bg-brand-800 shadow-nav">
        <Container className="flex h-20 items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-text-white sm:text-3xl">Teomed</h1>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.push('/settings/security')}
              variant="secondary"
              size="small"
              className="p-2"
              title="Configurações de Segurança"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Button>
            <Button onClick={handleLogout} variant="textLink" size="small" className="text-text-white opacity-80 hover:opacity-100">
              Sair
            </Button>
          </div>
        </Container>
      </header>

      {showMfaBanner && (
        <div className="border-b border-neutral-border bg-surface-light">
          <Container className="py-4">
            <Card hover={false} padding="sm" className="animate-fade-in border border-semantic-warning bg-surface-white">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="text-lg leading-none">⚠️</div>
                  <div className="text-sm text-text-secondary">
                    <strong className="font-semibold text-text-primary">Ação Necessária:</strong> Configure a autenticação em dois fatores para maior segurança da sua conta.
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => router.push('/settings/security?setup=required')}
                    variant="primary"
                    size="small"
                  >
                    Configurar Agora
                  </Button>
                  <button
                    onClick={() => setShowMfaBanner(false)}
                    className="rounded-full p-2 text-text-muted hover:text-text-primary focus-ring"
                    aria-label="Fechar banner"
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </Card>
          </Container>
        </div>
      )}

      <main>
        <Section title="Aplicações" className="bg-surface-light">
          <Container>
            {applications.length === 0 ? (
              <Card hover={false} padding="md" className="animate-fade-in">
                <p className="text-sm text-text-muted">Nenhuma aplicação cadastrada.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {applications.map((app) => (
                  <div key={app.id}>
                    {(() => {
                      const Wrapper: any = app.url ? 'a' : 'div';
                      const wrapperProps = app.url
                        ? {
                            href: app.url,
                            target: '_blank',
                            rel: 'noopener noreferrer',
                          }
                        : {};
                      return (
                        <Wrapper className="group block rounded-2xl focus-ring" {...wrapperProps}>
                          <Card className="h-full">
                            <div className="flex h-full flex-col gap-3">
                              <div>
                                <h3 className="text-base font-semibold text-text-primary">{app.name}</h3>
                                <p className="mt-2 text-sm text-text-secondary">{app.description}</p>
                              </div>

                              <div className="mt-auto flex items-center justify-between gap-4">
                                <span className="text-xs text-text-muted">
                                  {new Date(app.createdAt).toLocaleDateString('pt-BR')}
                                </span>
                                <span
                                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                    app.status === 'active'
                                      ? 'bg-semantic-success text-surface-white'
                                      : 'bg-semantic-warning text-surface-white'
                                  }`}
                                >
                                  {app.status === 'active' ? 'Ativo' : 'Inativo'}
                                </span>
                              </div>
                            </div>
                          </Card>
                        </Wrapper>
                      );
                    })()}
                  </div>
                ))}
              </div>
            )}
          </Container>
        </Section>
      </main>
    </div>
  );
}
