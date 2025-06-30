'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { BookService } from '@/services/book-service';
import { Book, CreateBookRequest } from '@/types/book';
import { Edit3, Save, X, CheckCircle } from 'lucide-react';

interface EditBookModalProps {
    book: Book | null;
    isOpen: boolean;
    onClose: () => void;
    onBookUpdated: () => void;
}

export function EditBookModal({ book, isOpen, onClose, onBookUpdated }: EditBookModalProps) {
    const [formData, setFormData] = useState<CreateBookRequest>({
        title: '',
        author: '',
        publishedYear: new Date().getFullYear(),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title,
                author: book.author,
                publishedYear: book.publishedYear,
            });
        }
        setError(null);
        setSuccess(false);
    }, [book]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!book) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            if (!formData.title?.trim() || !formData.author?.trim()) {
                throw new Error('Título e autor são obrigatórios');
            }

            if (!formData.publishedYear || formData.publishedYear < 1000 || formData.publishedYear > new Date().getFullYear() + 1) {
                throw new Error('Ano de publicação deve ser válido');
            }

            await BookService.updateBook(book.id, {
                title: formData.title.trim(),
                author: formData.author.trim(),
                publishedYear: formData.publishedYear,
            });

            setSuccess(true);

            onBookUpdated();

            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Erro ao atualizar livro');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof CreateBookRequest) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = field === 'publishedYear' ? parseInt(e.target.value) || 0 : e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleClose = () => {
        setError(null);
        setSuccess(false);
        onClose();
    };

    if (!book) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Edit3 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold text-gray-900">
                                Editar Livro
                            </DialogTitle>
                            <p className="text-sm text-gray-500 mt-1">
                                Atualize as informações do livro selecionado
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title" className="text-sm font-medium text-gray-700">
                                Título do Livro
                            </Label>
                            <Input
                                id="edit-title"
                                type="text"
                                value={formData.title || ''}
                                onChange={handleInputChange('title')}
                                placeholder="Digite o título do livro"
                                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={loading || success}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-author" className="text-sm font-medium text-gray-700">
                                Autor
                            </Label>
                            <Input
                                id="edit-author"
                                type="text"
                                value={formData.author || ''}
                                onChange={handleInputChange('author')}
                                placeholder="Digite o nome do autor"
                                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={loading || success}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-publishedYear" className="text-sm font-medium text-gray-700">
                                Ano de Publicação
                            </Label>
                            <Input
                                id="edit-publishedYear"
                                type="number"
                                value={formData.publishedYear || ''}
                                onChange={handleInputChange('publishedYear')}
                                placeholder="Ex: 2024"
                                min="1000"
                                max={new Date().getFullYear() + 1}
                                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={loading || success}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                            <div className="w-5 h-5 text-red-500 mt-0.5">⚠️</div>
                            <div>{error}</div>
                        </div>
                    )}

                    {success && (
                        <div className="p-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <div>Livro atualizado com sucesso! 🎉</div>
                        </div>
                    )}

                    <DialogFooter className="gap-3 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                            className="flex items-center space-x-2"
                        >
                            <X className="w-4 h-4" />
                            <span>Cancelar</span>
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || success}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Salvando...</span>
                                </>
                            ) : success ? (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Salvo!</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Salvar Alterações</span>
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}