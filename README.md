# MalaDireta (EM PROGRESSO)

Sistema completo de envio e gerenciamento de mensagens em massa para usuários cadastrados.

Desenvolvido com Node.js, React, Prisma ORM e MySQL, esse sistema permite criar mensagens com ou sem imagem, editar, deletar, enviar e manter um histórico detalhado de envios por usuário.

---

## Tecnologias Utilizadas

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Multer (upload de imagens)
- dotenv
- CORS
- Swagger (documentação da API)

### Frontend

- ReactJS
- Axios
- React Modal
- Componentização (MessageForm, MessageTable, EditModal, Header)

---

## Funcionalidades

### Mensagens

- Criar mensagens com título, conteúdo e imagem (opcional)
- Editar mensagens (somente se não enviadas)
- Excluir mensagens (somente se não enviadas)
- Enviar mensagens (restrito a administradores)
- Listar todas as mensagens

### Histórico

- Registro de envio por usuário
- Armazenamento no banco de dados via Prisma

### Usuários

- Cadastro e autenticação
- Identificação de administrador via middleware

### Upload de Imagens

- Imagens salvas na pasta `/uploads`
- Utilização de `multer` no backend para o upload
- Nomes únicos gerados com base em timestamps

---

## Como Rodar o Projeto

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Banco de Dados

Crie um arquivo `.env` no diretório `backend` com sua string de conexão:

```env
DATABASE_URL="mysql://user@localhost:3306/meubancodedados"
```

---

## Documentação da API

Acesse a documentação via Swagger:

http://localhost:3001/api-docs

---

## ERROS ACONTECENDO

- O botão de editar não funciona
- Bugs visuais
- A pasta uploads precisa ser criada na raiz do backend ao inciar o projeto

---

## Autor

João Vítor Justino Ferri  
GitHub: https://github.com/jvjfe

---
