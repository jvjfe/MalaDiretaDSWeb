import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import axios from 'axios';

const Header = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const emailLogado = localStorage.getItem('email');

    useEffect(() => {
        if (showModal) {
            axios.get('/usuarios')
                .then(res => {
                    setUsuarios(res.data);
                })
                .catch(err => {
                    console.error('Erro ao buscar usuários:', err);
                });
        }
    }, [showModal]);

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('email');
        navigate('/');
    };

    const atualizarPermissao = async (id, novoStatus, emailUsuario) => {
        if (emailUsuario === emailLogado) {
            alert('Você não pode alterar seu próprio status de admin.');
            return;
        }
        try {
            const token = localStorage.getItem('token');

            await axios.put(
                `/usuarios/${id}`,
                { admin: novoStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUsuarios(prev => prev.map(u => u.id === id ? { ...u, admin: novoStatus } : u));
        } catch (error) {
            console.error('Erro ao atualizar admin:', error);
            alert('Erro ao atualizar admin.');
        }
    };

    return (
        <>
            <header className="glass-header">
                <h1 className="logo">Mala Direta</h1>
                <div className="auth-buttons">
                    <button className="btn" onClick={() => setShowModal(true)}>Gerenciar Admins</button>
                    <button className="btn" onClick={handleLogout}>Logout</button>
                </div>
            </header>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Gerenciar Permissões de Admin</h2>
                        <table className="usuarios-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Email</th>
                                    <th>Admin</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(user => (
                                    <tr key={user.id} className={user.email === emailLogado ? 'logged-user' : ''}>
                                        <td>{user.nome}</td>
                                        <td>{user.email}</td>
                                        <td>{user.admin ? 'Sim' : 'Não'}</td>
                                        <td>
                                            <button
                                                className={`btn ${user.admin ? 'btn-remove' : 'btn-add'}`}
                                                onClick={() => atualizarPermissao(user.id, !user.admin, user.email)}
                                                disabled={user.email === emailLogado}
                                                title={user.email === emailLogado ? 'Você não pode alterar seu próprio status' : ''}
                                            >
                                                {user.admin ? 'Remover Admin' : 'Tornar Admin'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={() => setShowModal(false)} className="btn fechar-btn">Fechar</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
