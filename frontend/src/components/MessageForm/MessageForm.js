import React, { useState, useRef } from 'react';
import './MessageForm.css';

const MessageForm = ({ onSend }) => {
    const [titulo, setTitulo] = useState('');
    const [conteudo, setConteudo] = useState('');
    const [imagem, setImagem] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const textareaRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!titulo && !conteudo && !imagem) {
            alert('Preencha algum campo.');
            return;
        }

        setLoading(true);

        try {
            await onSend({
                title: titulo,
                text: conteudo,
                image: imagem
            });

            setTitulo('');
            setConteudo('');
            setImagem(null);
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
            setIsOpen(false);
        } catch (error) {
            alert('Erro ao enviar mensagem.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setImagem(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const insertFormatting = (symbol) => {
        if (!textareaRef.current) {
            setConteudo((prev) => prev + symbol + symbol);
            return;
        }

        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = conteudo.slice(start, end);

        let newText;
        if (selectedText) {
            newText = conteudo.slice(0, start) + symbol + selectedText + symbol + conteudo.slice(end);
            setConteudo(newText);
            setTimeout(() => {
                const pos = end + 2 * symbol.length;
                textarea.setSelectionRange(pos, pos);
                textarea.focus();
            }, 0);
        } else {
            newText = conteudo.slice(0, start) + symbol + symbol + conteudo.slice(end);
            setConteudo(newText);
            setTimeout(() => {
                const pos = start + symbol.length;
                textarea.setSelectionRange(pos, pos);
                textarea.focus();
            }, 0);
        }
    };

    return (
        <>
            <button className="open-modal-btn" onClick={() => setIsOpen(true)}>
                Nova Mensagem
            </button>

            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content larger-modal">
                        <h2>Enviar nova mensagem</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Título do e-mail"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    disabled={loading}
                                    accept="image/*"
                                />
                            </div>

                            <div className="form-group">
                                <div className="formatting-buttons">
                                    <button
                                        type="button"
                                        onClick={() => insertFormatting('**')}
                                        disabled={loading}
                                    >
                                        <b>Negrito</b>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => insertFormatting('*')}
                                        disabled={loading}
                                    >
                                        <i>Itálico</i>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => insertFormatting('~~')}
                                        disabled={loading}
                                    >
                                        <s>Riscado</s>
                                    </button>
                                </div>
                                <textarea
                                    ref={textareaRef}
                                    placeholder="Digite sua mensagem..."
                                    value={conteudo}
                                    onChange={(e) => setConteudo(e.target.value)}
                                    rows="6"
                                    disabled={loading}
                                />
                            </div>

                            {previewUrl && (
                                <div className="image-preview">
                                    <p>Prévia da imagem:</p>
                                    <img src={previewUrl} alt="Prévia" />
                                </div>
                            )}

                            <div className="form-actions">
                                <button type="submit" disabled={loading}>
                                    {loading ? 'Enviando...' : 'Enviar'}
                                </button>
                                <button
                                    type="button"
                                    className="close-btn"
                                    onClick={() => setIsOpen(false)}
                                    disabled={loading}
                                >
                                    Fechar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default MessageForm;
