import Fastify from 'fastify';
import cors from '@fastify/cors';
import booksRoutes from './routes/books';

const fastify = Fastify({
    logger: true
});

const start = async () => {
    try {
        // Registrar CORS
        await fastify.register(cors, {
            origin: ['http://localhost:3000'], // Frontend Next.js
            credentials: true
        });

        // Registrar rotas
        await fastify.register(booksRoutes);

        // Health check endpoint
        fastify.get('/health', async (request, reply) => {
            return { status: 'OK', message: 'API de Lista de Livros funcionando!' };
        });

        // Iniciar servidor
        const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
        await fastify.listen({ port, host: '0.0.0.0' });

        console.log(`🚀 Servidor rodando na porta ${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
