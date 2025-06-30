'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookService } from '@/services/book-service';
import { Book } from '@/types/book';
import { EditBookModal } from './edit-book-modal';
import { Search, Edit3, Trash2, BookOpen, Calendar, User, Loader2 } from 'lucide-react';

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

    const handleDeleteBook = async (bookId: string, bookTitle: string) => {
        if (!confirm(`Tem certeza que deseja deletar o livro "${bookTitle}"?`)) {
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
            <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3 text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-lg">Carregando sua biblioteca...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-500 text-2xl">⚠️</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ops! Algo deu errado</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => loadBooks()} variant="outline">
                    Tentar novamente
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Barra de Pesquisa */}
            <div className="relative">
                <Label htmlFor="search" className="sr-only">Buscar livros</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        id="search"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por título..."
                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Contador e Status */}
            <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>
                        {books.length} livro{books.length !== 1 ? 's' : ''}
                        {searchTerm && ` encontrado${books.length !== 1 ? 's' : ''} para "${searchTerm}"`}
                    </span>
                </div>
            </div>

            {/* Lista de Livros */}
            {books.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchTerm ? 'Nenhum livro encontrado' : 'Sua biblioteca está vazia'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                        {searchTerm
                            ? `Nenhum livro foi encontrado com o termo "${searchTerm}"`
                            : 'Comece adicionando seu primeiro livro usando o formulário ao lado'
                        }
                    </p>
                    {searchTerm && (
                        <Button
                            onClick={() => setSearchTerm('')}
                            variant="outline"
                            size="sm"
                        >
                            Limpar pesquisa
                        </Button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {books.map((book) => (
                        <Card key={book.id} className="group hover:shadow-md transition-all duration-200 border-gray-200/50">
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <h3 className="font-semibold text-lg text-gray-900 leading-tight pr-4">
                                            {book.title}
                                        </h3>
                                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <Button
                                                onClick={() => setEditingBook(book)}
                                                variant="outline"
                                                size="sm"
                                                className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                                            >
                                                <Edit3 className="w-3 h-3 mr-1" />
                                                Editar
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteBook(book.id, book.title)}
                                                variant="outline"
                                                size="sm"
                                                disabled={deletingBookId === book.id}
                                                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                                            >
                                                {deletingBookId === book.id ? (
                                                    <>
                                                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                                        Deletando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trash2 className="w-3 h-3 mr-1" />
                                                        Deletar
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center text-gray-600">
                                            <User className="w-4 h-4 mr-2 text-gray-400" />
                                            <span className="font-medium">Autor:</span>
                                            <span className="ml-2">{book.author}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            <span className="font-medium">Publicado em:</span>
                                            <span className="ml-2">{book.publishedYear}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <EditBookModal
                book={editingBook}
                isOpen={!!editingBook}
                onClose={() => setEditingBook(null)}
                onBookUpdated={handleBookUpdated}
            />
        </div>
    );
}
