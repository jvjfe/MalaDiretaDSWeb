import React, { useState, useEffect } from 'react';
import './EditModal.css';
import axios from 'axios';

const EditModal = ({ message, onClose, onSave }) => {
    const [titulo, setTitulo] = useState('');
    const [conteudo, setConteudo] = useState('');
    const [imagem, setImagem] = useState(null); // aqui será o arquivo, não string
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        if (message) {
            setTitulo(message.titulo || '');
            setConteudo(message.conteudo || '');
            setImagem(null); // limpar arquivo selecionado, pq a imagem vem como string nome
            if (message.imagem) {
                setPreviewUrl(`/uploads/${message.imagem}`);
            } else {
                setPreviewUrl('');
            }
        }
    }, [message]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagem(file); // salva o arquivo no estado
            setPreviewUrl(URL.createObjectURL(file)); // cria url temporária para preview
        }
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('titulo', titulo);
            formData.append('conteudo', conteudo);

            if (imagem) {
                formData.append('imagem', imagem);
            }

            const response = await axios.put(`/mensagens/${message.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Mensagem atualizada com sucesso!');
            onSave(response.data);
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
