const express = require('express')
const router = express.Router()
const prisma = require('../prisma')
const multer = require('multer')
const path = require('path')
const requireAdmin = require('../middlewares/auth')

// Configuração do multer para upload de imagem
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
        cb(null, name)
    }
})

const upload = multer({ storage })

// 🔁 GET - Listar todas as mensagens
router.get('/', async (req, res) => {
    try {
        const mensagens = await prisma.mensagem.findMany({
            orderBy: { id: 'desc' }
        })
        res.json(mensagens)
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error)
        res.status(500).json({ error: 'Erro ao buscar mensagens' })
    }
})

// Criar nova mensagem (com ou sem imagem)
router.post('/', upload.single('imagem'), async (req, res) => {
    const { titulo, conteudo } = req.body
    const imagem = req.file ? req.file.filename : null

    try {
        const mensagem = await prisma.mensagem.create({
            data: { titulo, conteudo, imagem }
        })
        res.status(201).json(mensagem)
    } catch (error) {
        console.error('Erro ao criar mensagem:', error)
        res.status(500).json({ error: 'Erro ao criar mensagem' })
    }
})

// Enviar mensagem (apenas admin)
router.post('/:id/enviar', requireAdmin, async (req, res) => {
    const { id } = req.params
    const userId = req.headers['usuario-id']

    const mensagem = await prisma.mensagem.update({
        where: { id: parseInt(id) },
        data: { enviado: true }
    })

    await prisma.historico.create({
        data: {
            usuarioId: parseInt(userId),
            mensagemId: mensagem.id
        }
    })

    res.send('Mensagem enviada e registrada no histórico.')
})

// Editar (somente se não enviado)
router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { titulo, conteudo, imagem } = req.body

    const msg = await prisma.mensagem.findUnique({ where: { id: parseInt(id) } })
    if (msg.enviado) return res.status(403).send('Mensagem já enviada, não pode editar.')

    const atualizada = await prisma.mensagem.update({
        where: { id: parseInt(id) },
        data: { titulo, conteudo, imagem }
    })

    res.json(atualizada)
})

// Deletar (somente se não enviado)
router.delete('/:id', async (req, res) => {
    const msg = await prisma.mensagem.findUnique({ where: { id: parseInt(req.params.id) } })
    if (msg.enviado) return res.status(403).send('Mensagem enviada não pode ser excluída.')

    await prisma.mensagem.delete({ where: { id: parseInt(req.params.id) } })
    res.send('Mensagem deletada.')
})

module.exports = router
