import { NextResponse } from 'next/server';
import { Application } from '../../dashboard/types';

export async function GET(request: Request) {
  try {
    // Verificar o token de autenticação
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }
    
    // Dados de exemplo para o dashboard
    const applications: Application[] = [
      {
        id: '1',
        name: 'Aplicação 1',
        description: 'Descrição da aplicação 1',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Aplicação 2',
        description: 'Descrição da aplicação 2',
        status: 'inactive',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '3',
        name: 'Aplicação 3',
        description: 'Descrição da aplicação 3',
        status: 'active',
        createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];
    
    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
