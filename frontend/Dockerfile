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

# Expor a porta que o Next.js usa
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
