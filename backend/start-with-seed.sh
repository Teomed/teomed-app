#!/bin/sh

# Executar o script de seed para garantir que os usuários estejam no banco de dados
echo "Executando script de seed para configurar usuários..."
node dist/seed.js

# Iniciar a aplicação
echo "Iniciando o servidor backend..."
npm start
