'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ReactElement, JSX } from 'react';
import { Application } from './types';

export default function Dashboard(): ReactElement {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchApplications(token);
  }, [router]);

  const fetchApplications = async (token: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
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
        name: app.name,
        description: app.description || 'Sem descrição',
        status: 'active', // Backend não tem status, assumir ativo
        createdAt: app.uploadedAt || app.createdAt || new Date().toISOString(),
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
      <div className="loading-container">
        <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-container">
          <h1 className="app-title">Teomed</h1>
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Sair
          </button>
        </div>
      </header>
      <main className="dashboard-main">
        <div className="main-header">
          <h2 className="page-title">Aplicações</h2>
          <button className="new-app-button">
            Nova Aplicação
          </button>
        </div>
        {applications.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">Nenhuma aplicação cadastrada.</p>
            <p className="empty-text">Clique em "Nova Aplicação" para começar.</p>
          </div>
        ) : (
          <div className="app-grid">
            {applications.map((app) => (
              <div
                key={app.id}
                className="app-card"
              >
                <h3 className="app-name">{app.name}</h3>
                <p className="app-description">{app.description}</p>
                <div className="card-footer">
                  <span className="app-date">
                    {new Date(app.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                  <div>
                    <span
                      className={`status-badge ${app.status === 'active' ? 'status-active' : 'status-inactive'}`}
                    >
                      {app.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                    <button className="text-[#666666] hover:text-black transition-colors">
                      Editar
                    </button>
                    <button className="text-[#666666] hover:text-black transition-colors">
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
