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
import { Book, UpdateBookRequest } from '@/types/book';

interface EditBookModalProps {
    book: Book | null;
    isOpen: boolean;
    onClose: () => void;
    onBookUpdated: () => void;
}

export function EditBookModal({ book, isOpen, onClose, onBookUpdated }: EditBookModalProps) {
    const [formData, setFormData] = useState<UpdateBookRequest>({
        title: '',
        author: '',
        publishedYear: new Date().getFullYear(),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Atualizar dados do formulário quando o livro mudar
    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title,
                author: book.author,
                publishedYear: book.publishedYear,
            });
        }
    }, [book]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!book) return;

        setLoading(true);
        setError(null);

        try {
            // Validação básica
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

            // Notificar componente pai e fechar modal
            onBookUpdated();
            onClose();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Erro ao atualizar livro');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof UpdateBookRequest) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = field === 'publishedYear' ? parseInt(e.target.value) || 0 : e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleClose = () => {
        setError(null);
        onClose();
    };

    if (!book) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>✏️ Editar Livro</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-title">Título *</Label>
                        <Input
                            id="edit-title"
                            type="text"
                            value={formData.title || ''}
                            onChange={handleInputChange('title')}
                            placeholder="Digite o título do livro"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-author">Autor *</Label>
                        <Input
                            id="edit-author"
                            type="text"
                            value={formData.author || ''}
                            onChange={handleInputChange('author')}
                            placeholder="Digite o nome do autor"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-publishedYear">Ano de Publicação *</Label>
                        <Input
                            id="edit-publishedYear"
                            type="number"
                            value={formData.publishedYear || ''}
                            onChange={handleInputChange('publishedYear')}
                            placeholder="Ex: 2023"
                            min="1000"
                            max={new Date().getFullYear() + 1}
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                            {error}
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
