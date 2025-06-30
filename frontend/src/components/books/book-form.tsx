'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookService } from '@/services/book-service';
import { CreateBookRequest } from '@/types/book';

interface BookFormProps {
    onBookCreated: () => void;
}

export function BookForm({ onBookCreated }: BookFormProps) {
    const [formData, setFormData] = useState<CreateBookRequest>({
        title: '',
        author: '',
        publishedYear: new Date().getFullYear(),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validação básica
            if (!formData.title.trim() || !formData.author.trim()) {
                throw new Error('Título e autor são obrigatórios');
            }

            if (formData.publishedYear < 1000 || formData.publishedYear > new Date().getFullYear() + 1) {
                throw new Error('Ano de publicação deve ser válido');
            }

            await BookService.createBook(formData);

            // Limpar formulário
            setFormData({
                title: '',
                author: '',
                publishedYear: new Date().getFullYear(),
            });

            // Notificar componente pai
            onBookCreated();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Erro ao criar livro');
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

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-center">📚 Cadastrar Novo Livro</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título *</Label>
                        <Input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={handleInputChange('title')}
                            placeholder="Digite o título do livro"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="author">Autor *</Label>
                        <Input
                            id="author"
                            type="text"
                            value={formData.author}
                            onChange={handleInputChange('author')}
                            placeholder="Digite o nome do autor"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="publishedYear">Ano de Publicação *</Label>
                        <Input
                            id="publishedYear"
                            type="number"
                            value={formData.publishedYear}
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

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar Livro'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
