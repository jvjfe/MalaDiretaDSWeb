import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './MessageTable.css';

const MessageTable = ({ messages, onSend, onEdit, onDelete, loadingEmailId }) => {
    const [viewingMessage, setViewingMessage] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const handleConfirmDelete = () => {
        if (confirmDeleteId !== null) {
            onDelete(confirmDeleteId);
            setConfirmDeleteId(null);
        }
    };

    const handleCancelDelete = () => {
        setConfirmDeleteId(null);
    };

    return (
        <div className="message-table-container">
            <h2>Lista de Emails Criados</h2>
            <table className="message-table" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.map((msg) => (
                        <tr key={msg.id}>
                            <td>{msg.id}</td>
                            <td>{msg.titulo}</td>
                            <td className={msg.enviado ? 'status-sent' : 'status-not-sent'}>
                                {msg.enviado ? 'Enviado' : 'Não enviado'}
                            </td>
                            <td>
                                {!msg.enviado ? (
                                    <>
                                        <button
                                            onClick={() => onSend(msg.id)}
                                            disabled={loadingEmailId === msg.id}
                                        >
                                            {loadingEmailId === msg.id ? 'Enviando...' : 'Enviar'}
                                        </button>{' '}
                                        <button onClick={() => onEdit(msg.id)}>Editar</button>{' '}
                                        <button onClick={() => setConfirmDeleteId(msg.id)}>Excluir</button>
                                    </>
                                ) : (
                                    <button onClick={() => setViewingMessage(msg)}>Ver</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {viewingMessage && (
                <div className="message-modal-overlay" onClick={() => setViewingMessage(null)}>
                    <div
                        className="message-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ReactMarkdown>{viewingMessage.conteudo}</ReactMarkdown>

                        <button onClick={() => setViewingMessage(null)}>Fechar</button>
                    </div>
                </div>
            )}


            {confirmDeleteId !== null && (
                <div className="confirm-delete-modal-overlay" onClick={handleCancelDelete}>
                    <div className="confirm-delete-modal-content" onClick={(e) => e.stopPropagation()}>
                        <p>Tem certeza que deseja excluir o email ID {confirmDeleteId}?</p>
                        <div className="confirm-delete-buttons">
                            <button onClick={handleConfirmDelete}>Sim, excluir</button>
                            <button onClick={handleCancelDelete}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageTable;
