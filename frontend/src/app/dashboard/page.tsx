'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ReactElement } from 'react';
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
      const response = await fetch('http://localhost:3001/applications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar aplicações');
      }

      const data = await response.json();
      setApplications(data);
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <svg className="animate-spin h-6 w-6 text-[#0066FF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="h-16 border-b border-[#E5E5E5] flex items-center px-6">
        <div className="w-full max-w-[1200px] mx-auto flex justify-between items-center">
          <h1 className="text-[15px] font-medium text-black">Teomed App</h1>
          <button
            onClick={handleLogout}
            className="text-[15px] text-[#666666] hover:text-black transition-colors"
          >
            Sair
          </button>
        </div>
      </header>
      <main className="w-full max-w-[1200px] mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-[24px] font-medium text-black">Aplicações</h2>
          <button className="h-10 px-4 bg-[#0066FF] text-white text-[15px] rounded-lg hover:bg-[#0052CC] transition-colors">
            Nova Aplicação
          </button>
        </div>
        {applications.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[15px] text-[#666666]">Nenhuma aplicação cadastrada.</p>
            <p className="mt-1 text-[15px] text-[#666666]">Clique em "Nova Aplicação" para começar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-6 bg-white border border-[#E5E5E5] rounded-lg hover:border-[#0066FF] transition-colors"
              >
                <h3 className="text-[17px] font-medium text-black mb-1">{app.name}</h3>
                <p className="text-[15px] text-[#666666] mb-4">{app.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-[#666666]">
                    {new Date(app.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-[13px] ${app.status === 'active' ? 'bg-[#E3F2E6] text-[#1C7A2C]' : 'bg-[#FFF4E5] text-[#B25D05]'}`}
                  >
                    {app.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
