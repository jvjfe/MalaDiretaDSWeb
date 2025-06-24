import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAdmin }) => {  // recebe a prop setIsAdmin
    const [loginData, setLoginData] = useState({ email: '', senha: '' });
    const [registerData, setRegisterData] = useState({ nome: '', email: '', senha: '', admin: false });
    const [showDenied, setShowDenied] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Tentando login com:', loginData);

        try {
            const response = await axios.post('/usuarios/login', loginData);
            const { user, token } = response.data;

            console.log('Resposta do login:', user);

            if (user.admin) {
                console.log('Login como admin, redirecionando...');
                localStorage.setItem('isAdmin', 'true');
                localStorage.setItem('email', user.email);
                localStorage.setItem('token', token);

                setIsAdmin(true);

                navigate('/home');
            } else {
                console.log('Usuário sem permissão de admin');
                setShowDenied(true);
                localStorage.removeItem('isAdmin');
                localStorage.removeItem('email');
                localStorage.removeItem('token');

                setIsAdmin(false);
            }

        } catch (error) {
            console.error('Erro ao logar:', error.response ? error.response.data : error.message);
            alert('Credenciais inválidas.');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log('Tentando registrar com:', registerData);

        try {
            await axios.post('/usuarios', registerData);
            console.log('Registro realizado com sucesso!');
            alert('Registrado com sucesso! Agora você pode logar.');
            setRegisterData({ nome: '', email: '', senha: '', admin: false });
        } catch (error) {
            console.error('Erro ao registrar:', error.response ? error.response.data : error.message);
            alert('Erro no registro. Verifique os dados.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-section">
                    <h2>Login</h2>
                    <form className="login-form" onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={loginData.senha}
                            onChange={(e) => setLoginData({ ...loginData, senha: e.target.value })}
                            required
                        />
                        <button type="submit">Entrar</button>
                    </form>
                </div>

                <div className="register-section">
                    <h2>Registro</h2>
                    <form className="register-form" onSubmit={handleRegister}>
                        <input
                            type="text"
                            placeholder="Nome"
                            value={registerData.nome}
                            onChange={(e) => setRegisterData({ ...registerData, nome: e.target.value })}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={registerData.email}
                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={registerData.senha}
                            onChange={(e) => setRegisterData({ ...registerData, senha: e.target.value })}
                            required
                        />
                        {/* admin sempre false no registro */}
                        <input type="hidden" value={registerData.admin} />
                        <button type="submit">Registrar</button>
                    </form>
                </div>
            </div>

            {showDenied && (
                <div className="access-denied-modal">
                    <div className="access-denied-content">
                        <h3>Acesso negado</h3>
                        <p>Você não tem permissão de administrador para acessar esta página.</p>
                        <button onClick={() => setShowDenied(false)}>Voltar ao login</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
