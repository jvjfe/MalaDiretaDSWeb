require('dotenv').config()

// Pacotes
const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./docs/swagger')
const path = require('path')


// Inicializações
const app = express()
const prisma = new PrismaClient()
app.set('prisma', prisma)

// Middlewares globais
app.use(cors())
app.use(express.json())
app.use('/envio-email', require('./routes/email'));


// Servir imagens da pasta uploads (rota pública)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Rotas principais
app.use('/usuarios', require('./routes/usuarios'))
app.use('/mensagens', require('./routes/mensagens'))
app.use('/historico', require('./routes/historico'))

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Inicialização do servidor
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.clear(); // Limpa o terminal para facilitar a visualização
    console.log('==========================================');
    console.log('🚀 Servidor iniciado com sucesso!');
    console.log('🔗 API rodando em:       http://localhost:' + PORT);
    console.log('📚 Documentação Swagger: http://localhost:' + PORT + '/api-docs');
    console.log('📦 Ambiente:             ' + (process.env.NODE_ENV || 'development'));
    console.log('🕒 Iniciado em:          ' + new Date().toLocaleString());
    console.log('==========================================\n');
});
