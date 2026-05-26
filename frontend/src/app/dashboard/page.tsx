'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ReactElement, JSX } from 'react';
import { Application } from './types';

export default function Dashboard(): ReactElement {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [userEmail, setUserEmail] = useState<string>('');
  const router = useRouter();

  const ADMIN_EMAIL = 'jllcorrea50@gmail.com';
  const isAdmin = userEmail === ADMIN_EMAIL;

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

    // Decodificar token para obter email do usuário
    const decoded = decodeToken(token);
    if (decoded && decoded.email) {
      setUserEmail(decoded.email);
    }

    // Verificar se precisa configurar MFA
    if (decoded && decoded.requiresSetup) {
      router.push('/settings/security?setup=required');
      return;
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

  const handleNewApp = () => {
    setEditingApp(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const handleEditApp = (app: Application) => {
    setEditingApp(app);
    setFormData({ name: app.name, description: app.description });
    setShowModal(true);
  };

  const handleDeleteApp = async (appId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta aplicação?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
      
      const response = await fetch(`${apiUrl}/applications/${appId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir aplicação');
      }

      // Atualizar lista removendo a aplicação excluída
      setApplications(applications.filter(app => app.id !== appId));
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir aplicação');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
      
      const url = editingApp 
        ? `${apiUrl}/applications/${editingApp.id}`
        : `${apiUrl}/applications`;
      
      const method = editingApp ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar aplicação');
      }

      const data = await response.json();
      
      if (editingApp) {
        // Atualizar aplicação existente
        setApplications(applications.map(app => 
          app.id === editingApp.id 
            ? { ...app, name: data.name, description: data.description }
            : app
        ));
      } else {
        // Adicionar nova aplicação
        const newApp: Application = {
          id: data._id,
          name: data.name,
          description: data.description || 'Sem descrição',
          status: 'active',
          createdAt: data.uploadedAt || data.createdAt || new Date().toISOString(),
        };
        setApplications([...applications, newApp]);
      }
      
      setShowModal(false);
      setFormData({ name: '', description: '' });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar aplicação');
    }
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
          <div className="header-actions">
            <button
              onClick={() => router.push('/settings/security')}
              className="settings-button"
              title="Configurações de Segurança"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="logout-button"
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="dashboard-main">
        <div className="main-header">
          <h2 className="page-title">Aplicações</h2>
          {isAdmin && (
            <button onClick={handleNewApp} className="new-app-button">
              Nova Aplicação
            </button>
          )}
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
                    {isAdmin && (
                      <>
                        <button 
                          onClick={() => handleEditApp(app)}
                          className="text-[#666666] hover:text-black transition-colors"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDeleteApp(app.id)}
                          className="text-[#666666] hover:text-red-600 transition-colors"
                        >
                          Excluir
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Nova/Editar Aplicação */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingApp ? 'Editar Aplicação' : 'Nova Aplicação'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Nome</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder="Nome da aplicação"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">Descrição</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                  placeholder="Descrição da aplicação"
                  rows={4}
                  required
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                >
                  {editingApp ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
