const express = require('express');
const router = express.Router();
const prisma = require('../prisma');
const multer = require('multer');
const path = require('path');
const requireAdmin = require('../middlewares/auth');

// Configuração do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, name);
    },
});
const upload = multer({ storage });

// GET - Listar todas as mensagens com dados do usuário e histórico
router.get('/', async (req, res) => {
    try {
        const mensagens = await prisma.mensagem.findMany({
            orderBy: { id: 'desc' },
            include: {
                historicos: {
                    include: {
                        usuario: true,
                    },
                    orderBy: {
                        data: 'asc',
                    },
                },
            },
        });

        const mensagensComUsuario = mensagens.map(msg => {
            const primeiroEnvio = msg.historicos[0] || null;

            return {
                id: msg.id,
                titulo: msg.titulo,
                conteudo: msg.conteudo,
                imagem: msg.imagem,
                enviado: msg.enviado,
                enviadoEm: primeiroEnvio?.data || null,
                usuario: primeiroEnvio?.usuario || null,
            };
        });

        res.json(mensagensComUsuario);
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        res.status(500).json({ error: 'Erro ao buscar mensagens' });
    }
});


// POST - Criar nova mensagem
router.post('/', upload.single('imagem'), async (req, res) => {
    const { titulo, conteudo } = req.body;
    const imagem = req.file ? req.file.filename : null;

    try {
        const mensagem = await prisma.mensagem.create({
            data: { titulo, conteudo, imagem },
        });
        res.status(201).json(mensagem);
    } catch (error) {
        console.error('Erro ao criar mensagem:', error);
        res.status(500).json({ error: 'Erro ao criar mensagem' });
    }
});

// POST - Enviar mensagem
router.post('/:id/enviar', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(req.headers['usuario-id']);

    try {
        const mensagem = await prisma.mensagem.update({
            where: { id: parseInt(id) },
            data: { enviado: true },
        });

        const historico = await prisma.historico.create({
            data: {
                usuarioId: userId,
                mensagemId: mensagem.id,
            },
        });

        res.send('Mensagem enviada e registrada no histórico.');
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        res.status(500).json({ error: 'Erro ao registrar envio.' });
    }
});

// PUT - Editar (somente se não enviado) - com multer para receber arquivo
router.put('/:id', upload.single('imagem'), async (req, res) => {
    const { id } = req.params;
    const { titulo, conteudo, imagem: imagemAntiga } = req.body;

    try {
        const msg = await prisma.mensagem.findUnique({ where: { id: parseInt(id) } });
        if (msg.enviado) return res.status(403).send('Mensagem já enviada, não pode editar.');

        const novaImagem = req.file ? req.file.filename : imagemAntiga || msg.imagem;

        const atualizada = await prisma.mensagem.update({
            where: { id: parseInt(id) },
            data: {
                titulo,
                conteudo,
                imagem: novaImagem,
            },
        });

        res.json(atualizada);
    } catch (error) {
        console.error('Erro ao editar mensagem:', error);
        res.status(500).json({ error: 'Erro ao editar mensagem.' });
    }
});

// DELETE - Deletar (somente se não enviado)
router.delete('/:id', async (req, res) => {
    const msg = await prisma.mensagem.findUnique({ where: { id: parseInt(req.params.id) } });
    if (msg.enviado) return res.status(403).send('Mensagem enviada não pode ser excluída.');

    await prisma.mensagem.delete({ where: { id: parseInt(req.params.id) } });
    res.send('Mensagem deletada.');
});

// PATCH - Atualizar campo enviado
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { enviado } = req.body;

    try {
        const mensagem = await prisma.mensagem.update({
            where: { id: parseInt(id) },
            data: { enviado: Boolean(enviado) },
        });

        res.json(mensagem);
    } catch (error) {
        console.error('Erro ao atualizar mensagem:', error);
        res.status(500).json({ error: 'Erro ao atualizar status da mensagem.' });
    }
});

module.exports = router;
