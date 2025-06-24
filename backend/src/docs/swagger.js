module.exports = {
    openapi: "3.0.0",
    info: {
        title: "Mala Direta API",
        version: "1.0.0",
        description: "API para envio de mensagens com controle de usuários e histórico.",
    },
    servers: [
        { url: "http://localhost:3001" },
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
                                            id: { type: "integer", example: 1 },
                                            nome: { type: "string", example: "João Vítor" },
                                            email: { type: "string", example: "joao@email.com" },
                                            admin: { type: "boolean", example: false },
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
                                    nome: { type: "string", example: "João Vítor" },
                                    email: { type: "string", example: "joao@email.com" },
                                    senha: { type: "string", example: "senha123" },
                                    admin: { type: "boolean", example: false },
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
                                        id: { type: "integer", example: 1 },
                                        nome: { type: "string", example: "João Vítor" },
                                        email: { type: "string", example: "joao@email.com" },
                                        admin: { type: "boolean", example: false },
                                    },
                                },
                            },
                        },
                    },
                    400: { description: "Dados inválidos" },
                    409: { description: "Email já cadastrado" },
                },
            },
        },

        "/usuarios/criar": {
            get: {
                summary: "Cria um usuário via query string (não recomendado)",
                parameters: [
                    { name: "nome", in: "query", required: true, schema: { type: "string" } },
                    { name: "email", in: "query", required: true, schema: { type: "string" } },
                    { name: "senha", in: "query", required: true, schema: { type: "string" } },
                ],
                responses: {
                    200: { description: "Usuário criado com sucesso (via GET)" },
                    400: { description: "Parâmetros ausentes" },
                    409: { description: "Email já cadastrado" },
                },
            },
        },

        "/usuarios/login": {
            post: {
                summary: "Autentica um usuário",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string", example: "joao@email.com" },
                                    senha: { type: "string", example: "senha123" },
                                },
                                required: ["email", "senha"],
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Login realizado com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        user: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer", example: 1 },
                                                nome: { type: "string", example: "João Vítor" },
                                                email: { type: "string", example: "joao@email.com" },
                                                admin: { type: "boolean", example: false },
                                            },
                                        },
                                        token: { type: "string", example: "jwt.token.aqui" },
                                    },
                                },
                            },
                        },
                    },
                    400: { description: "Campos obrigatórios não informados" },
                    401: { description: "Credenciais inválidas" },
                },
            },
        },

        "/usuarios/{id}": {
            put: {
                summary: "Atualiza os dados de um usuário (requer autenticação)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    nome: { type: "string", example: "Novo Nome" },
                                    email: { type: "string", example: "novo@email.com" },
                                    senha: { type: "string", example: "novasenha123" },
                                    admin: { type: "boolean", example: true },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Usuário atualizado com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        id: { type: "integer", example: 1 },
                                        nome: { type: "string", example: "Novo Nome" },
                                        email: { type: "string", example: "novo@email.com" },
                                        admin: { type: "boolean", example: false },
                                    },
                                },
                            },
                        },
                    },
                    401: { description: "Não autenticado" },
                    403: { description: "Não pode alterar seu próprio status de admin" },
                    404: { description: "Usuário não encontrado" },
                    409: { description: "Email já cadastrado" },
                },
            },
        },

        // ===================== MENSAGENS =====================
        "/mensagens": {
            get: {
                summary: "Lista todas as mensagens",
                responses: {
                    200: {
                        description: "Lista de mensagens retornada com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer", example: 1 },
                                            titulo: { type: "string", example: "Mensagem de boas-vindas" },
                                            conteudo: { type: "string", example: "Olá, mundo!" },
                                            imagem: { type: "string", example: "img123.png" },
                                            enviado: { type: "boolean", example: false },
                                            enviadoEm: { type: "string", format: "date-time", example: "2025-06-24T12:00:00Z" },
                                            usuario: {
                                                type: "object",
                                                nullable: true,
                                                properties: {
                                                    id: { type: "integer", example: 1 },
                                                    nome: { type: "string", example: "João Vítor" },
                                                    email: { type: "string", example: "joao@email.com" },
                                                },
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
                summary: "Cria uma nova mensagem",
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": {
                            schema: {
                                type: "object",
                                properties: {
                                    titulo: { type: "string", example: "Nova mensagem" },
                                    conteudo: { type: "string", example: "Texto da mensagem." },
                                    imagem: { type: "string", format: "binary" },
                                },
                                required: ["titulo", "conteudo"],
                            },
                        },
                    },
                },
                responses: {
                    201: { description: "Mensagem criada com sucesso" },
                    500: { description: "Erro ao criar mensagem" },
                },
            },
        },

        "/mensagens/{id}/enviar": {
            post: {
                summary: "Envia uma mensagem (apenas admins)",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                    },
                ],
                responses: {
                    200: { description: "Mensagem enviada com sucesso" },
                    403: { description: "Não autorizado" },
                    500: { description: "Erro interno" },
                },
            },
        },

        "/mensagens/{id}": {
            put: {
                summary: "Edita uma mensagem (se ainda não enviada)",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": {
                            schema: {
                                type: "object",
                                properties: {
                                    titulo: { type: "string", example: "Título editado" },
                                    conteudo: { type: "string", example: "Conteúdo editado" },
                                    imagem: { type: "string", format: "binary" },
                                    imagemAntiga: { type: "string", example: "antiga.png" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: "Mensagem atualizada com sucesso" },
                    403: { description: "Mensagem já enviada, não pode editar" },
                    500: { description: "Erro ao editar" },
                },
            },
            delete: {
                summary: "Deleta uma mensagem (se não enviada)",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                    },
                ],
                responses: {
                    200: { description: "Mensagem deletada com sucesso" },
                    403: { description: "Mensagem enviada, não pode deletar" },
                    500: { description: "Erro ao deletar" },
                },
            },
            patch: {
                summary: "Atualiza o campo 'enviado' da mensagem",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    enviado: { type: "boolean", example: true },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: "Status de envio atualizado" },
                    500: { description: "Erro ao atualizar" },
                },
            },
        },
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
};
