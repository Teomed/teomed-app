import * as bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

// Função para aguardar um tempo específico
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface UserSeed {
  email: string;
  password: string;
}

interface ApplicationSeed {
  name: string;
  description: string;
  version: string;
  downloadUrl: string;
  category: string;
}

async function seedAuthUsers() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/teomed-db';
  const client = new MongoClient(uri);
  
  // Tentativas de conexão
  let connected = false;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (!connected && attempts < maxAttempts) {
    try {
      console.log(`Tentativa ${attempts + 1} de conexão com MongoDB em ${uri}`);
      await client.connect();
      connected = true;
      console.log('Conectado ao MongoDB com sucesso!');
    } catch (error) {
      attempts++;
      console.log(`Falha na conexão. Tentando novamente em 3 segundos... (${attempts}/${maxAttempts})`);
      await sleep(3000);
    }
  }
  
  if (!connected) {
    console.error(`Falha ao conectar ao MongoDB após ${maxAttempts} tentativas. Abortando.`);
    process.exit(1);
  }
  
  try {
    const database = client.db();
    const authCollection = database.collection('auths');

    // Limpar usuários existentes para garantir que tenhamos os usuários corretos
    await authCollection.deleteMany({});
    console.log('Usuários existentes removidos.');


    // IMPORTANTE: Em produção, estes dados devem vir de variáveis de ambiente
    const usersToSeed: UserSeed[] = [
      { email: 'jllcorrea50@gmail.com', password: 'Anatomia531@' },
      { email: 'relacionamento.teomed@gmail.com', password: 'Anatomia532@' },
      { email: 'renataellenoliveira@gmail.com', password: 'Anatomia533@' }
    ];

    for (const user of usersToSeed) {
      const passwordHash = await bcrypt.hash(user.password, 10);
      await authCollection.insertOne({
        email: user.email,
        passwordHash,
        createdAt: new Date()
      });
      console.log(`Usuário ${user.email} criado com sucesso.`);
    }
    console.log('Seeding de usuários concluído.');
  } catch (error) {
    console.error('Erro ao fazer seeding dos usuários:', error);
  } finally {
    await client.close();
  }
}

async function seedApplications() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/teomed-db';
  const client = new MongoClient(uri);
  
  // Tentativas de conexão
  let connected = false;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (!connected && attempts < maxAttempts) {
    try {
      console.log(`Tentativa ${attempts + 1} de conexão com MongoDB para applications em ${uri}`);
      await client.connect();
      connected = true;
      console.log('Conectado ao MongoDB com sucesso para applications!');
    } catch (error) {
      attempts++;
      console.log(`Falha na conexão. Tentando novamente em 3 segundos... (${attempts}/${maxAttempts})`);
      await sleep(3000);
    }
  }
  
  if (!connected) {
    console.error(`Falha ao conectar ao MongoDB após ${maxAttempts} tentativas. Abortando applications.`);
    process.exit(1);
  }
  
  try {
    const database = client.db();
    const applicationsCollection = database.collection('applications');

    // Limpar applications existentes
    await applicationsCollection.deleteMany({});
    console.log('Applications existentes removidas.');

    // Dados fictícios de applications
    const applicationsToSeed: ApplicationSeed[] = [
      {
        name: 'Teomed-Filemaker',
        description: 'Prontuário médico completo: história clínica, exame físico, exames pré e pós-operatórios, evoluções, receitas, atestados e anexos.',
        version: '2.1.4',
        downloadUrl: 'https://download.example.com/teomed-viewer-2.1.4.zip',
        category: 'Imaging'
      },
      {
        name: 'Consultas Novas',
        description: 'Controle de pacientes que passam pela consulta e seu seguimento, inclusive no pós-operatório e após a cirurgia.',
        version: '1.8.2',
        downloadUrl: 'https://download.example.com/patientflow-1.8.2.dmg',
        category: 'Management'
      },
      {
        name: 'Financeiro',
        description: 'Gestão financeira do consultório: receitas de consultas e cirurgias, pagamentos da equipe e controle de despesas e gastos.',
        version: '3.0.1',
        downloadUrl: 'https://download.example.com/lab-analyzer-3.0.1.exe',
        category: 'Laboratory'
      },
      {
        name: 'Consultas-Google',
        description: 'Captura consultas do Google Agenda e cria um banco de dados com análise de ganhos, produtividade e evolução do faturamento.',
        version: '4.2.7',
        downloadUrl: 'https://download.example.com/medchart-mobile-4.2.7.apk',
        category: 'Mobile'
      },
      {
        name: 'Faxina',
        description: 'Pagamento e controle da faxineira: dias trabalhados, recibos, valores e relatórios do trabalho efetuado.',
        version: '1.5.0',
        downloadUrl: 'https://download.example.com/prescription-gen-1.5.0.msi',
        category: 'Clinical'
      },
      {
        name: 'Faxina Casa',
        description: 'Pagamento e controle da faxina da casa do Dr. José Luis: dias, recibos, valores e relatórios do trabalho efetuado.',
        version: '2.3.8',
        downloadUrl: 'https://download.example.com/surgical-planner-2.3.8.tar.gz',
        category: 'Surgery'
      }
    ];

    for (const app of applicationsToSeed) {
      await applicationsCollection.insertOne({
        name: app.name,
        description: app.description,
        version: app.version,
        downloadUrl: app.downloadUrl,
        category: app.category,
        uploadedAt: new Date()
      });
      console.log(`Application ${app.name} criada com sucesso.`);
    }
    console.log('Seeding de applications concluído.');
  } catch (error) {
    console.error('Erro ao fazer seeding das applications:', error);
  } finally {
    await client.close();
  }
}

async function runAllSeeds() {
  console.log('=== Iniciando processo de seeding ===');
  
  console.log('\n1. Seeding usuários de autenticação...');
  await seedAuthUsers();
  
  console.log('\n2. Seeding applications...');
  await seedApplications();
  
  console.log('\n=== Seeding concluído com sucesso! ===');
}

runAllSeeds();
