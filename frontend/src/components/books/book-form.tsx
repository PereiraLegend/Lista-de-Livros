'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookService } from '@/services/book-service';
import { CreateBookRequest } from '@/types/book';
import { BookPlus, CheckCircle } from 'lucide-react';

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
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            if (!formData.title.trim() || !formData.author.trim()) {
                throw new Error('Título e autor são obrigatórios');
            }

            if (formData.publishedYear < 1000 || formData.publishedYear > new Date().getFullYear() + 1) {
                throw new Error('Ano de publicação deve ser válido');
            }

            await BookService.createBook(formData);

            setSuccess(true);

            setFormData({
                title: '',
                author: '',
                publishedYear: new Date().getFullYear(),
            });

            onBookCreated();

            setTimeout(() => setSuccess(false), 3000);
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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                        Título do Livro
                    </Label>
                    <Input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={handleInputChange('title')}
                        placeholder="Digite o título do livro"
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="author" className="text-sm font-medium text-gray-700">
                        Autor
                    </Label>
                    <Input
                        id="author"
                        type="text"
                        value={formData.author}
                        onChange={handleInputChange('author')}
                        placeholder="Digite o nome do autor"
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="publishedYear" className="text-sm font-medium text-gray-700">
                        Ano de Publicação
                    </Label>
                    <Input
                        id="publishedYear"
                        type="number"
                        value={formData.publishedYear}
                        onChange={handleInputChange('publishedYear')}
                        placeholder="Ex: 2024"
                        min="1000"
                        max={new Date().getFullYear() + 1}
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <div>Livro cadastrado com sucesso! 🎉</div>
                </div>
            )}

            <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Cadastrando...</span>
                    </>
                ) : (
                    <>
                        <BookPlus className="w-4 h-4" />
                        <span>Cadastrar Livro</span>
                    </>
                )}
            </Button>
        </form>
    );
}
