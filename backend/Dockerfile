FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o resto dos arquivos do projeto
COPY . .

# Construir a aplicação
RUN npm run build

# Expor a porta que o NestJS usa
EXPOSE 3003

# Copiar script de inicialização
COPY start-with-seed.sh /app/start-with-seed.sh
RUN chmod +x /app/start-with-seed.sh

# Comando para iniciar a aplicação com seed
CMD ["/app/start-with-seed.sh"]
