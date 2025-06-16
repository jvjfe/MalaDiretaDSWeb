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

// Servir imagens da pasta uploads (rota pública)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Rotas principais
app.use('/usuarios', require('./routes/usuarios'))
app.use('/mensagens', require('./routes/mensagens'))
app.use('/historico', require('./routes/historico'))

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Inicialização do servidor
const PORT = process.env.PORT || 3001
app.listen(PORT, () =>
    console.log(`✅ Servidor rodando em http://localhost:${PORT}/api-docs`)
)
