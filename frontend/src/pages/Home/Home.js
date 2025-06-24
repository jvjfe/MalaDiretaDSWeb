import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MessageForm from '../../components/MessageForm/MessageForm.js';
import MessageTable from '../../components/MessageTable/MessageTable.js';
import EditModal from '../../components/EditModal/EditModal.js';
import Header from '../../components/Header/Header.js';
import { marked } from 'marked';


const Home = () => {
    const [messages, setMessages] = useState([]);
    const [editingMessage, setEditingMessage] = useState(null);
    const [loadingEmailId, setLoadingEmailId] = useState(null);

    useEffect(() => {
        axios.get('/mensagens')
            .then(res => setMessages(res.data))
            .catch(err => console.error('Erro ao buscar mensagens:', err));
    }, []);

    const addMessage = (msg) => {
        const formData = new FormData();
        formData.append('titulo', msg.title);
        formData.append('conteudo', msg.text);
        if (msg.image) {
            formData.append('imagem', msg.image);
        }

        const token = localStorage.getItem('token');

        axios.post('/mensagens', formData, {
            headers: {
                Authorization: token ? `Bearer ${token}` : '',
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(res => {
                setMessages(prev => [...prev, res.data]);
            })
            .catch(err => {
                console.error('Erro ao criar mensagem:', err);
            });
    };

    const sendMessage = async (id) => {
        if (loadingEmailId) return;
        const msg = messages.find(m => m.id === id);
        if (!msg) return;

        const destinatarios = prompt('Digite os e-mails separados por vírgula:');
        if (!destinatarios) return;

        const emails = destinatarios.split(',').map(e => e.trim()).filter(e => e);

        try {
            setLoadingEmailId(id);

            await axios.post('/envio-email', {
                emails,
                subject: msg.titulo,
                message: marked(msg.conteudo),
            });


            await axios.patch(`/mensagens/${id}`, { enviado: true });

            setMessages(prev =>
                prev.map(m => m.id === id ? { ...m, enviado: true } : m)
            );

            alert('E-mail enviado com sucesso!');
        } catch (err) {
            console.error('Erro ao enviar mensagem:', err);
            alert('Erro ao enviar e-mail.');
        } finally {
            setLoadingEmailId(null);
        }
    };

    const deleteMessage = (id) => {
        axios.delete(`/mensagens/${id}`)
            .then(() => {
                setMessages(prev => prev.filter(m => m.id !== id));
            })
            .catch(err => {
                alert('Erro ao excluir mensagem. Talvez ela já tenha sido enviada.');
                console.error('Erro ao excluir:', err);
            });
    };

    // Salva edição
    const saveEdit = (updatedMsg) => {
        axios.put(`/mensagens/${updatedMsg.id}`, {
            titulo: updatedMsg.title,
            conteudo: updatedMsg.text,
            imagem: updatedMsg.image
        }).then(res => {
            setMessages(prev =>
                prev.map(m => m.id === updatedMsg.id ? res.data : m)
            );
            setEditingMessage(null);
        }).catch(err => {
            alert('Erro ao salvar edição. Talvez a mensagem já tenha sido enviada.');
            console.error('Erro ao editar:', err);
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <Header />
            <MessageForm onSend={addMessage} />
            <MessageTable
                messages={messages}
                onSend={sendMessage}
                onEdit={(id) => setEditingMessage(messages.find(m => m.id === id))}
                onDelete={deleteMessage}
                loadingEmailId={loadingEmailId}
            />
            {editingMessage && (
                <EditModal
                    message={editingMessage}
                    onClose={() => setEditingMessage(null)}
                    onSave={saveEdit}
                />
            )}
        </div>
    );
};

export default Home;
