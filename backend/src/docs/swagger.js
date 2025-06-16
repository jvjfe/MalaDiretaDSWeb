module.exports = {
    openapi: "3.0.0",
    info: {
        title: "Mala Direta API",
        version: "1.0.0",
        description: "API para envio de mensagens com controle de usuários e histórico.",
    },
    servers: [
        {
            url: "http://localhost:3001",
        },
    ],
    paths: {
        "/usuarios": {
            get: {
                summary: "Lista todos os usuários",
                description: "Retorna a lista completa de usuários cadastrados, sem expor senhas.",
                responses: {
                    200: {
                        description: "Lista de usuários retornada com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "integer",
                                                example: 1,
                                            },
                                            nome: {
                                                type: "string",
                                                example: "João Vítor",
                                            },
                                            email: {
                                                type: "string",
                                                example: "joao@email.com",
                                            },
                                            admin: {
                                                type: "boolean",
                                                example: false,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                summary: "Cria um novo usuário",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    nome: {
                                        type: "string",
                                        example: "João Vítor",
                                    },
                                    email: {
                                        type: "string",
                                        example: "joao@email.com",
                                    },
                                    senha: {
                                        type: "string",
                                        example: "senha123",
                                        description: "Senha do usuário (texto puro, será armazenada conforme implementação)",
                                    },
                                    admin: {
                                        type: "boolean",
                                        example: false,
                                        description: "Define se o usuário é administrador",
                                    },
                                },
                                required: ["nome", "email", "senha", "admin"],
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Usuário criado com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "integer",
                                            example: 1,
                                        },
                                        nome: {
                                            type: "string",
                                            example: "João Vítor",
                                        },
                                        email: {
                                            type: "string",
                                            example: "joao@email.com",
                                        },
                                        admin: {
                                            type: "boolean",
                                            example: false,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: "Dados inválidos",
                    },
                    409: {
                        description: "Email já cadastrado",
                    },
                },
            },
        },
    },
};
