import React, { useState } from 'react';
import './MessageGrid.css';
import ReactMarkdown from 'react-markdown';

const MessageGrid = ({ messages }) => {
    const [selectedMessage, setSelectedMessage] = useState(null);

    return (
        <div className="message-grid-container">
            <h2>Mensagens Enviadas</h2>
            <div className="message-grid">
                {messages.map((msg) => (
                    <div key={msg.id} className="message-card">
                        <h3>{msg.title}</h3>
                        {msg.image && <img src={msg.image} alt="imagem" />}
                        <button onClick={() => setSelectedMessage(msg)}>Ver mais</button>
                    </div>
                ))}
            </div>

            {selectedMessage && (
                <div
                    className="message-modal-overlay"
                    onClick={() => setSelectedMessage(null)}
                >
                    <div
                        className="message-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>{selectedMessage.title}</h2>
                        {selectedMessage.image && (
                            <img
                                src={selectedMessage.image}
                                alt="imagem completa"
                            />
                        )}
                        <ReactMarkdown>{selectedMessage.text}</ReactMarkdown>
                        <p><small>Enviado em: {selectedMessage.sentAt}</small></p>
                        <button onClick={() => setSelectedMessage(null)}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageGrid;
