'use client';

import { useState } from 'react';
import { BookForm } from '@/components/books/book-form';
import { BookList } from '@/components/books/book-list';
import { ApiStatus } from '@/components/api-status';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBookCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            📚 Gerenciador de Lista de Livros
          </h1>
          <p className="text-lg text-slate-600 mb-6">
            Cadastre e gerencie sua coleção de livros
          </p>
          <ApiStatus />
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Formulário de Cadastro */}
          <div className="flex flex-col">
            <BookForm onBookCreated={handleBookCreated} />
          </div>

          {/* Lista de Livros */}
          <div className="flex flex-col">
            <BookList refreshTrigger={refreshTrigger} />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-slate-500">
          <p>
            💻 Desenvolvido com Next.js, Fastify e TypeScript
          </p>
        </footer>
      </div>
    </main>
  );
}
