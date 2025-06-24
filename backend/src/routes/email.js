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

    const msg = await prisma.mensagem.findFirst({
        where: { titulo: subject },
    });

    if (!msg) {
        return res.status(404).json({ error: 'Mensagem não encontrada.' });
    }

    const attachments = [];

    let finalHtml = message;

    if (msg.imagem) {
        attachments.push({
            path: path.join(process.cwd(), 'uploads', msg.imagem),
            cid: 'imagempromo'
        });

        finalHtml = `
        <div style="text-align: center;">
            <img src="cid:imagempromo" alt="Imagem" style="max-width: 100%; height: auto;" />
        </div>
        <div>${message}</div>
    `;
    } else {
        finalHtml = message;
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
        html: finalHtml,
        attachments,
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
