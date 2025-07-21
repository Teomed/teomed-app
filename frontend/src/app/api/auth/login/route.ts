import { NextResponse } from 'next/server';

// Lista de usuários válidos com suas senhas
const validUsers = [
  { email: 'jllcorrea50@gmail.com', password: 'Anatomia531@', name: 'José Luis Correa' },
  { email: 'relacionamento.teomed@gmail.com', password: 'Anatomia532@', name: 'Teomed Relacionamento' },
  { email: 'renataellenoliveira@gmail.com', password: 'Anatomia533@', name: 'Renata Ellen Oliveira' }
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    console.log('Tentativa de login:', { email });
    
    // Normalizar o email (remover espaços e converter para minúsculas)
    const normalizedEmail = email.trim().toLowerCase();
    
    // Verificar se o email e senha correspondem a um usuário válido
    const user = validUsers.find(u => 
      u.email.toLowerCase() === normalizedEmail && 
      u.password === password
    );
    
    console.log('Usuário encontrado:', !!user);
    
    if (user) {
      // Retorna um token de acesso simulado
      return NextResponse.json({ 
        access_token: 'mock_token_' + Date.now(),
        user: {
          id: validUsers.indexOf(user).toString(),
          email: user.email,
          name: user.name
        }
      }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Email ou senha inválidos' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
