import * as bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

interface UserSeed {
  email: string;
  password: string;
}

async function seedAuthUsers() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/teomed';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db();
    const authCollection = database.collection('auths');

    const existingUsersCount = await authCollection.countDocuments();
    if (existingUsersCount >= 3) {
      console.log('Já existem 3 ou mais usuários cadastrados. Ignorando seeding.');
      return;
    }

    // IMPORTANTE: Em produção, estes dados devem vir de variáveis de ambiente
    const usersToSeed: UserSeed[] = [
      { email: 'admin@teomed.com', password: 'senha123forte' },
      { email: 'medico@teomed.com', password: 'minhasenhaunica' },
      { email: 'gestor@teomed.com', password: 'acessoteomedapp' }
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

seedAuthUsers();
