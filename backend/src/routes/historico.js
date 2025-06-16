const express = require('express')
const router = express.Router()
const prisma = require('../prisma')

// GET /historico — lista todo o histórico
router.get('/', async (req, res) => {
    try {
        const historico = await prisma.historico.findMany({
            include: {
                usuario: true,
                mensagem: true
            },
            orderBy: {
                data: 'desc'
            }
        })
        res.json(historico)
    } catch (error) {
        console.error('Erro ao buscar histórico:', error)
        res.status(500).json({ error: 'Erro ao buscar histórico' })
    }
})

module.exports = router
