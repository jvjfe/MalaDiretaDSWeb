const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = async function requireAdmin(req, res, next) {
    const userId = req.headers['usuario-id']
    if (!userId) return res.status(401).send('ID do usuário é obrigatório.')

    const user = await prisma.usuario.findUnique({ where: { id: parseInt(userId) } })
    if (!user || !user.admin) return res.status(403).send('Apenas administradores podem enviar mensagens.')

    next()
}
