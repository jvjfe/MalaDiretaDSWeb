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

            {/* Modal de visualização */}
            {viewingMessage && (
                <div className="message-modal-overlay" onClick={() => setViewingMessage(null)}>
                    <div
                        className="message-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>{viewingMessage.titulo}</h2>

                        {viewingMessage.imagem ? (
                            <img
                                src={`/uploads/${viewingMessage.imagem}`}
                                alt="Imagem do email"
                                style={{ maxWidth: '100%', maxHeight: 300, marginBottom: 10 }}
                            />
                        ) : (
                            <p><em>Sem imagem anexada</em></p>
                        )}

                        <ReactMarkdown>{viewingMessage.conteudo}</ReactMarkdown>

                        <p><strong>Enviado por:</strong> {viewingMessage.usuario?.email || 'Desconhecido'}</p>
                        <p><strong>Enviado em:</strong> {viewingMessage.enviadoEm ? new Date(viewingMessage.enviadoEm).toLocaleString() : 'Não enviado'}</p>

                        <button onClick={() => setViewingMessage(null)}>Fechar</button>
                    </div>
                </div>
            )}

            {/* Modal de confirmação de exclusão */}
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
