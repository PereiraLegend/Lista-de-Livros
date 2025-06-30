import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Book, CreateBookRequest, UpdateBookRequest } from '../types/book';
import { DatabaseService } from '../database/database';

const dbService = new DatabaseService();

export default async function booksRoutes(fastify: FastifyInstance) {
    // GET /books - Listar todos os livros ou filtrar por título
    fastify.get('/books', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { title } = request.query as { title?: string };

            const books = await dbService.getAllBooks(title);

            return reply.code(200).send({
                success: true,
                data: books,
                total: books.length
            });
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
            return reply.code(500).send({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    });

    // GET /books/:id - Buscar livro por ID
    fastify.get('/books/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: string };

            const book = await dbService.getBookById(id);

            if (!book) {
                return reply.code(404).send({
                    success: false,
                    message: 'Livro não encontrado'
                });
            }

            return reply.code(200).send({
                success: true,
                data: book
            });
        } catch (error) {
            console.error('Erro ao buscar livro:', error);
            return reply.code(500).send({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    });

    // POST /books - Adicionar um novo livro
    fastify.post('/books', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { title, author, publishedYear } = request.body as CreateBookRequest;

            if (!title || !author || !publishedYear) {
                return reply.code(400).send({
                    success: false,
                    message: 'Todos os campos são obrigatórios: title, author, publishedYear'
                });
            }

            if (typeof publishedYear !== 'number' || publishedYear < 0) {
                return reply.code(400).send({
                    success: false,
                    message: 'publishedYear deve ser um número válido'
                });
            }

            const newBook = await dbService.createBook({
                title: title.trim(),
                author: author.trim(),
                publishedYear
            });

            return reply.code(201).send({
                success: true,
                message: 'Livro criado com sucesso',
                data: newBook
            });
        } catch (error) {
            console.error('Erro ao criar livro:', error);
            return reply.code(500).send({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    });

    // PUT /books/:id - Atualizar um livro completo
    fastify.put('/books/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: string };
            const { title, author, publishedYear } = request.body as CreateBookRequest;

            if (!title || !author || !publishedYear) {
                return reply.code(400).send({
                    success: false,
                    message: 'Todos os campos são obrigatórios: title, author, publishedYear'
                });
            }

            if (typeof publishedYear !== 'number' || publishedYear < 0) {
                return reply.code(400).send({
                    success: false,
                    message: 'publishedYear deve ser um número válido'
                });
            }

            const updatedBook = await dbService.updateBook(id, {
                title: title.trim(),
                author: author.trim(),
                publishedYear
            });

            if (!updatedBook) {
                return reply.code(404).send({
                    success: false,
                    message: 'Livro não encontrado'
                });
            }

            return reply.code(200).send({
                success: true,
                message: 'Livro atualizado com sucesso',
                data: updatedBook
            });
        } catch (error) {
            console.error('Erro ao atualizar livro:', error);
            return reply.code(500).send({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    });

    // PATCH /books/:id - Atualizar parcialmente um livro
    fastify.patch('/books/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: string };
            const updateData = request.body as UpdateBookRequest;

            if (!updateData.title && !updateData.author && !updateData.publishedYear) {
                return reply.code(400).send({
                    success: false,
                    message: 'Pelo menos um campo deve ser fornecido para atualização'
                });
            }

            if (updateData.publishedYear !== undefined &&
                (typeof updateData.publishedYear !== 'number' || updateData.publishedYear < 0)) {
                return reply.code(400).send({
                    success: false,
                    message: 'publishedYear deve ser um número válido'
                });
            }

            const cleanedData: UpdateBookRequest = {};
            if (updateData.title) cleanedData.title = updateData.title.trim();
            if (updateData.author) cleanedData.author = updateData.author.trim();
            if (updateData.publishedYear) cleanedData.publishedYear = updateData.publishedYear;

            const updatedBook = await dbService.updateBook(id, cleanedData);

            if (!updatedBook) {
                return reply.code(404).send({
                    success: false,
                    message: 'Livro não encontrado'
                });
            }

            return reply.code(200).send({
                success: true,
                message: 'Livro atualizado com sucesso',
                data: updatedBook
            });
        } catch (error) {
            console.error('Erro ao atualizar livro:', error);
            return reply.code(500).send({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    });

    // DELETE /books/:id - Deletar um livro
    fastify.delete('/books/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: string };

            const deleted = await dbService.deleteBook(id);

            if (!deleted) {
                return reply.code(404).send({
                    success: false,
                    message: 'Livro não encontrado'
                });
            }

            return reply.code(200).send({
                success: true,
                message: 'Livro deletado com sucesso'
            });
        } catch (error) {
            console.error('Erro ao deletar livro:', error);
            return reply.code(500).send({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    });
}
