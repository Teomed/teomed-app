# Teomed App - Docker Setup

Este documento explica como executar a aplicação Teomed usando Docker, facilitando o compartilhamento e execução em diferentes computadores.

## Pré-requisitos

- [Docker](https://www.docker.com/get-started) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado (geralmente vem com Docker Desktop)

## Estrutura do Docker

A aplicação foi configurada com Docker para facilitar o desenvolvimento e compartilhamento:

- **Frontend**: Container Next.js rodando na porta 3000
- **Backend**: Container NestJS rodando na porta 3003

## Como executar a aplicação

1. Abra um terminal na pasta raiz do projeto (onde está o arquivo `docker-compose.yml`)

2. Execute o comando para construir e iniciar os containers:

```bash
docker-compose up
```

3. Para executar em segundo plano (modo detached):

```bash
docker-compose up -d
```

4. Acesse a aplicação no navegador:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3003

## Comandos úteis

- **Parar os containers**:
```bash
docker-compose down
```

- **Reconstruir os containers** (após alterações nos Dockerfiles):
```bash
docker-compose up --build
```

- **Ver logs dos containers**:
```bash
docker-compose logs
```

- **Ver logs de um serviço específico**:
```bash
docker-compose logs frontend
# ou
docker-compose logs backend
```

## Compartilhando com outros computadores

Para compartilhar a aplicação com outros computadores:

1. Certifique-se de que todo o código está em um repositório Git
2. A outra pessoa precisa clonar o repositório
3. Com Docker instalado, basta executar `docker-compose up`

Não é necessário instalar Node.js, npm ou quaisquer outras dependências no computador host, pois tudo é executado dentro dos containers Docker.

## Solução de problemas

- **Portas em uso**: Se as portas 3000 ou 3003 já estiverem em uso, você pode alterá-las no arquivo `docker-compose.yml`
- **Problemas de permissão**: Em alguns sistemas Linux pode ser necessário usar `sudo` antes dos comandos Docker
- **Containers não reiniciam**: Verifique os logs com `docker-compose logs` para identificar possíveis erros
