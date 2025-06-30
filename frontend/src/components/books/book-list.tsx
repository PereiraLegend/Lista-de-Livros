'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookService } from '@/services/book-service';
import { Book } from '@/types/book';
import { EditBookModal } from './edit-book-modal';

interface BookListProps {
    refreshTrigger: number;
}

export function BookList({ refreshTrigger }: BookListProps) {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [deletingBookId, setDeletingBookId] = useState<string | null>(null);

    const loadBooks = async (title?: string) => {
        try {
            setLoading(true);
            setError(null);
            const booksData = await BookService.getAllBooks(title);
            setBooks(booksData);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Erro ao carregar livros');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBook = async (bookId: string) => {
        if (!confirm('Tem certeza que deseja deletar este livro?')) {
            return;
        }

        try {
            setDeletingBookId(bookId);
            await BookService.deleteBook(bookId);
            await loadBooks(searchTerm || undefined);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Erro ao deletar livro');
        } finally {
            setDeletingBookId(null);
        }
    };

    const handleBookUpdated = () => {
        loadBooks(searchTerm || undefined);
    };

    useEffect(() => {
        loadBooks();
    }, [refreshTrigger]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadBooks(searchTerm || undefined);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    if (loading) {
        return (
            <Card className="w-full">
                <CardContent className="p-6">
                    <div className="text-center text-muted-foreground">
                        📖 Carregando livros...
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-full">
                <CardContent className="p-6">
                    <div className="text-center text-red-600">
                        ❌ {error}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-center">📚 Lista de Livros</CardTitle>
                <div className="space-y-2">
                    <Label htmlFor="search">Buscar por título:</Label>
                    <Input
                        id="search"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Digite o título do livro..."
                    />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {books.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        {searchTerm ?
                            `📝 Nenhum livro encontrado com "${searchTerm}"` :
                            '📝 Nenhum livro cadastrado ainda'
                        }
                    </div>
                ) : (
                    <>
                        <div className="text-sm text-muted-foreground text-center">
                            {books.length} livro{books.length !== 1 ? 's' : ''} encontrado{books.length !== 1 ? 's' : ''}
                        </div>
                        <div className="grid gap-4">
                            {books.map((book) => (
                                <Card key={book.id} className="bg-slate-50">
                                    <CardContent className="p-4">
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-lg text-slate-800">
                                                📖 {book.title}
                                            </h3>
                                            <p className="text-slate-600">
                                                ✍️ <span className="font-medium">Autor:</span> {book.author}
                                            </p>
                                            <p className="text-slate-600">
                                                📅 <span className="font-medium">Publicado em:</span> {book.publishedYear}
                                            </p>
                                            <div className="flex gap-2 mt-4">
                                                <Button
                                                    onClick={() => setEditingBook(book)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                                >
                                                    ✏️ Editar
                                                </Button>
                                                <Button
                                                    onClick={() => handleDeleteBook(book.id)}
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={deletingBookId === book.id}
                                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                                >
                                                    {deletingBookId === book.id ? '🔄 Deletando...' : '🗑️ Deletar'}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>

            {/* Modal de Edição */}
            <EditBookModal
                book={editingBook}
                isOpen={!!editingBook}
                onClose={() => setEditingBook(null)}
                onBookUpdated={handleBookUpdated}
            />
        </Card>
    );
}
