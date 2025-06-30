import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { Book, CreateBookRequest, UpdateBookRequest } from '../types/book';
import { v4 as uuidv4 } from 'uuid';

export class DatabaseService {
    private db: sqlite3.Database;
    private dbPath: string;

    constructor() {
        this.dbPath = path.join(__dirname, '../../data/books.db');
        this.db = new sqlite3.Database(this.dbPath);
        this.initializeDatabase();
    }

    private async initializeDatabase(): Promise<void> {
        try {
            // Criar tabela de livros
            await this.runQuery(`
                CREATE TABLE IF NOT EXISTS books (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    author TEXT NOT NULL,
                    publishedYear INTEGER NOT NULL,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Verificar se há dados na tabela
            const count = await this.countBooks();

            // Se não houver dados, inserir dados iniciais
            if (count === 0) {
                await this.seedInitialData();
            }

            console.log('📚 Banco de dados SQLite inicializado com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao inicializar banco de dados:', error);
        }
    }

    private async seedInitialData(): Promise<void> {
        const initialBooks = [
            {
                id: uuidv4(),
                title: "O Senhor dos Anéis",
                author: "J.R.R. Tolkien",
                publishedYear: 1954
            },
            {
                id: uuidv4(),
                title: "1984",
                author: "George Orwell",
                publishedYear: 1949
            },
            {
                id: uuidv4(),
                title: "Dom Casmurro",
                author: "Machado de Assis",
                publishedYear: 1899
            }
        ];

        for (const book of initialBooks) {
            await this.runQuery(
                'INSERT INTO books (id, title, author, publishedYear) VALUES (?, ?, ?, ?)',
                [book.id, book.title, book.author, book.publishedYear]
            );
        }

        console.log('📖 Dados iniciais inseridos no banco de dados');
    }

    private runQuery(sql: string, params: any[] = []): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    private getQuery(sql: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    private allQuery(sql: string, params: any[] = []): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async getAllBooks(titleFilter?: string): Promise<Book[]> {
        try {
            let query = 'SELECT * FROM books';
            let params: any[] = [];

            if (titleFilter) {
                query += ' WHERE title LIKE ? COLLATE NOCASE';
                params.push(`%${titleFilter}%`);
            }

            query += ' ORDER BY createdAt DESC';

            const rows = await this.allQuery(query, params) as Book[];
            return rows;
        } catch (error) {
            console.error('❌ Erro ao buscar livros:', error);
            throw error;
        }
    }

    async getBookById(id: string): Promise<Book | null> {
        try {
            const book = await this.getQuery('SELECT * FROM books WHERE id = ?', [id]) as Book;
            return book || null;
        } catch (error) {
            console.error('❌ Erro ao buscar livro por ID:', error);
            throw error;
        }
    }

    async createBook(bookData: CreateBookRequest): Promise<Book> {
        try {
            const id = uuidv4();
            const now = new Date().toISOString();

            await this.runQuery(
                'INSERT INTO books (id, title, author, publishedYear, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
                [id, bookData.title, bookData.author, bookData.publishedYear, now, now]
            );

            const newBook = await this.getQuery('SELECT * FROM books WHERE id = ?', [id]) as Book;
            return newBook;
        } catch (error) {
            console.error('❌ Erro ao criar livro:', error);
            throw error;
        }
    }

    async updateBook(id: string, bookData: UpdateBookRequest): Promise<Book | null> {
        try {
            // Verificar se o livro existe
            const existingBook = await this.getBookById(id);
            if (!existingBook) {
                return null;
            }

            // Construir query de update dinamicamente
            const updateFields: string[] = [];
            const values: any[] = [];

            if (bookData.title !== undefined) {
                updateFields.push('title = ?');
                values.push(bookData.title);
            }

            if (bookData.author !== undefined) {
                updateFields.push('author = ?');
                values.push(bookData.author);
            }

            if (bookData.publishedYear !== undefined) {
                updateFields.push('publishedYear = ?');
                values.push(bookData.publishedYear);
            }

            updateFields.push('updatedAt = ?');
            values.push(new Date().toISOString());
            values.push(id);

            const query = `UPDATE books SET ${updateFields.join(', ')} WHERE id = ?`;

            await this.runQuery(query, values);

            const updatedBook = await this.getQuery('SELECT * FROM books WHERE id = ?', [id]) as Book;
            return updatedBook;
        } catch (error) {
            console.error('❌ Erro ao atualizar livro:', error);
            throw error;
        }
    }

    async deleteBook(id: string): Promise<boolean> {
        try {
            // Verificar se o livro existe
            const existingBook = await this.getBookById(id);
            if (!existingBook) {
                return false;
            }

            await this.runQuery('DELETE FROM books WHERE id = ?', [id]);
            return true;
        } catch (error) {
            console.error('❌ Erro ao deletar livro:', error);
            throw error;
        }
    }

    private async countBooks(): Promise<number> {
        try {
            const result = await this.getQuery('SELECT COUNT(*) as count FROM books') as { count: number };
            return result.count;
        } catch (error) {
            console.error('❌ Erro ao contar livros:', error);
            return 0;
        }
    }

    async close(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    console.error('❌ Erro ao fechar banco de dados:', err);
                    reject(err);
                } else {
                    console.log('✅ Banco de dados fechado com sucesso');
                    resolve();
                }
            });
        });
    }
}
