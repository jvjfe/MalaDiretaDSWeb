import React, { useState, useEffect } from 'react';
import './EditModal.css';
import axios from 'axios';

const EditModal = ({ message, onClose, onSaved }) => {
    const [titulo, setTitulo] = useState('');
    const [conteudo, setConteudo] = useState('');
    const [imagem, setImagem] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        if (message) {
            setTitulo(message.titulo || '');
            setConteudo(message.conteudo || '');
            setImagem(message.imagem || '');
            setPreviewUrl(message.imagem || '');
        }
    }, [message]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagem(reader.result); // Base64 para simular upload
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`/mensagens/${message.id}`, {
                titulo,
                conteudo,
                imagem
            });

            alert('Mensagem atualizada com sucesso!');
            onSaved(response.data); // passa o novo objeto atualizado para o pai
            onClose();
        } catch (error) {
            console.error('Erro ao salvar mensagem:', error);
            alert('Erro ao salvar a mensagem. Verifique se ela já foi enviada.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Editar Mensagem</h2>

                <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Título"
                />

                <textarea
                    rows="5"
                    value={conteudo}
                    onChange={(e) => setConteudo(e.target.value)}
                    placeholder="Conteúdo"
                />

                <input
                    type="file"
                    onChange={handleImageChange}
                />

                {previewUrl && (
                    <img src={previewUrl} alt="Preview" />
                )}

                <div className="modal-footer">
                    <button onClick={handleSave}>Salvar</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
