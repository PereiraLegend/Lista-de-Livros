import { Book, CreateBookRequest, UpdateBookRequest, ApiResponse } from '@/types/book';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class BookService {
    static async getAllBooks(title?: string): Promise<Book[]> {
        try {
            const url = new URL(`${API_BASE_URL}/books`);
            if (title) {
                url.searchParams.append('title', title);
            }

            const response = await fetch(url.toString());

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const result: ApiResponse<Book[]> = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Erro ao buscar livros');
            }

            return result.data || [];
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
            throw error;
        }
    }

    static async createBook(book: CreateBookRequest): Promise<Book> {
        try {
            const response = await fetch(`${API_BASE_URL}/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book),
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const result: ApiResponse<Book> = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Erro ao criar livro');
            }

            if (!result.data) {
                throw new Error('Dados do livro não retornados');
            }

            return result.data;
        } catch (error) {
            console.error('Erro ao criar livro:', error);
            throw error;
        }
    }

    static async getBookById(id: string): Promise<Book> {
        try {
            const response = await fetch(`${API_BASE_URL}/books/${id}`);

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const result: ApiResponse<Book> = await response.json();

            if (!result.success || !result.data) {
                throw new Error(result.message || 'Livro não encontrado');
            }

            return result.data;
        } catch (error) {
            console.error('Erro ao buscar livro por ID:', error);
            throw error;
        }
    }

    static async updateBook(id: string, book: CreateBookRequest): Promise<Book> {
        try {
            const response = await fetch(`${API_BASE_URL}/books/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro na resposta:', errorText);
                throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
            }

            const result: ApiResponse<Book> = await response.json();

            if (!result.success || !result.data) {
                throw new Error(result.message || 'Erro ao atualizar livro');
            }

            return result.data;
        } catch (error) {
            console.error('Erro ao atualizar livro:', error);
            throw error;
        }
    }

    static async updateBookPartial(id: string, book: UpdateBookRequest): Promise<Book> {
        try {
            const response = await fetch(`${API_BASE_URL}/books/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro na resposta:', errorText);
                throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
            }

            const result: ApiResponse<Book> = await response.json();

            if (!result.success || !result.data) {
                throw new Error(result.message || 'Erro ao atualizar livro');
            }

            return result.data;
        } catch (error) {
            console.error('Erro ao atualizar livro:', error);
            throw error;
        }
    }

    static async deleteBook(id: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/books/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const result: ApiResponse<void> = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Erro ao deletar livro');
            }
        } catch (error) {
            console.error('Erro ao deletar livro:', error);
            throw error;
        }
    }

    static async checkHealth(): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            return response.ok;
        } catch (error) {
            console.error('Erro ao verificar saúde da API:', error);
            return false;
        }
    }
}
