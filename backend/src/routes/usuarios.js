const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Middleware simples de autenticação JWT para popular req.user
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido.' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token inválido.' });

    try {
        const secret = process.env.JWT_SECRET || 'seusegredoaqui'; // Defina sua chave secreta de JWT no .env
        const decoded = jwt.verify(token, secret);
        req.user = decoded; // aqui o token deve conter o email (ex: { email: 'usuario@email.com', id: 123, ... })
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
};

// Lista todos os usuários
router.get('/', async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                admin: true
            }
        });
        res.json(usuarios);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Criar usuário via GET (não recomendado, mas mantido)
router.get('/criar', async (req, res) => {
    const { nome, email, senha } = req.query;
    if (!nome || !email || !senha) {
        return res.status(400).send('Nome, e-mail e senha são obrigatórios.');
    }

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const novo = await prisma.usuario.create({
            data: { nome, email, senha: hashedPassword }
        });
        res.json(novo);
    } catch (err) {
        if (err.code === 'P2002') return res.status(409).send('Email já cadastrado.');
        console.error(err);
        res.status(500).send('Erro ao criar usuário.');
    }
});

// Criar usuário via POST
router.post('/', async (req, res) => {
    const { nome, email, senha, admin } = req.body;

    if (!nome || !email || !senha || typeof admin !== 'boolean') {
        return res.status(400).json({
            error: 'Campos nome, email, senha e admin (true ou false) são obrigatórios.'
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);

        const novoUsuario = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: hashedPassword,
                admin
            }
        });

        res.status(201).json({
            id: novoUsuario.id,
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            admin: novoUsuario.admin
        });
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'Email já cadastrado.' });
        }
        console.error('Erro ao criar usuário:', err);
        res.status(500).json({ error: 'Erro interno ao criar usuário.' });
    }
});

// Login do usuário via POST /usuarios/login
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
        const usuario = await prisma.usuario.findUnique({
            where: { email }
        });

        if (!usuario) {
            console.log('Usuário não encontrado:', email);
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            console.log('Senha incorreta para usuário:', email);
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        // Gerar token JWT para o usuário
        const secret = process.env.JWT_SECRET || 'seusegredoaqui';
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, admin: usuario.admin },
            secret,
            { expiresIn: '8h' }
        );

        console.log('Login sucesso:', usuario.email);
        const { senha: _, ...userData } = usuario;
        return res.json({ user: userData, token });

    } catch (err) {
        console.error('Erro no login:', err);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Atualizar usuário - protegida por authMiddleware
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, admin } = req.body;

    const emailLogado = req.user?.email;
    if (!emailLogado) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
        // Buscar usuário a ser atualizado para obter seu email
        const usuarioAtual = await prisma.usuario.findUnique({
            where: { id: Number(id) },
            select: { email: true }
        });

        if (!usuarioAtual) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // Bloquear alteração do próprio status admin
        if (usuarioAtual.email === emailLogado && typeof admin === 'boolean') {
            return res.status(403).json({ error: 'Você não pode alterar seu próprio status de admin.' });
        }

        const dataAtualizada = {};
        if (nome !== undefined) dataAtualizada.nome = nome;
        if (email !== undefined) dataAtualizada.email = email;
        if (typeof admin === 'boolean') dataAtualizada.admin = admin;

        if (senha !== undefined) {
            const hashedPassword = await bcrypt.hash(senha, 10);
            dataAtualizada.senha = hashedPassword;
        }

        const usuarioAtualizado = await prisma.usuario.update({
            where: { id: Number(id) },
            data: dataAtualizada,
        });

        const { senha: _, ...userSemSenha } = usuarioAtualizado;
        res.json(userSemSenha);

    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'Email já cadastrado por outro usuário.' });
        }
        console.error('Erro ao atualizar usuário:', err);
        res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    }
});

module.exports = router;
