const express = require('express');
const path = require('path');
const router = express.Router();
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.post('/', async (req, res) => {
    const { emails, subject, message } = req.body;

    if (!emails || !subject || !message) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    // Busca a mensagem com a imagem (assumindo que subject é o título único)
    const msg = await prisma.mensagem.findFirst({
        where: { titulo: subject },
    });

    if (!msg) {
        return res.status(404).json({ error: 'Mensagem não encontrada.' });
    }

    const attachments = [];

    if (msg.imagem) {
        attachments.push({
            filename: msg.imagem,
            path: path.join(process.cwd(), 'uploads', msg.imagem)
        });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emails.join(','),
        subject,
        text: message,
        attachments, // adiciona imagem como anexo
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'E-mail enviado com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao enviar o e-mail.' });
    }
});

module.exports = router;
