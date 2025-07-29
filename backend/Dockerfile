FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências (production only for smaller image)
RUN npm ci --only=production && npm cache clean --force

# Instalar dependências de desenvolvimento para build
RUN npm install

# Copiar o resto dos arquivos do projeto
COPY . .

# Construir a aplicação
RUN npm run build

# Remover dependências de desenvolvimento
RUN npm prune --production

# Expor a porta que o NestJS usa
EXPOSE 3003

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copiar script de inicialização
COPY start-with-seed.sh /app/start-with-seed.sh
RUN chmod +x /app/start-with-seed.sh

# Mudar para usuário não-root
USER nestjs

# Comando para iniciar a aplicação com seed
CMD ["sh", "/app/start-with-seed.sh"]
