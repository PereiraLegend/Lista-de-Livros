'use client';

import { useState, useEffect } from 'react';
import { BookForm } from '@/components/books/book-form';
import { BookList } from '@/components/books/book-list';
import { Header } from '@/components/header';
import { BookService } from '@/services/book-service';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [booksCount, setBooksCount] = useState(0);

  const handleBookCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const loadBooksCount = async () => {
      try {
        const books = await BookService.getAllBooks();
        setBooksCount(books.length);
      } catch (error) {
        console.error('Erro ao carregar contagem de livros:', error);
      }
    };

    loadBooksCount();
  }, [refreshTrigger]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Header booksCount={booksCount} />

      <main className="container mx-auto px-6 py-12">

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{booksCount}</div>
                <div className="text-sm text-gray-600">Livros Cadastrados</div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔄</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">Sincronizado</div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">Real-time</div>
                <div className="text-sm text-gray-600">Atualização</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid xl:grid-cols-12 gap-8 max-w-7xl mx-auto">
          {/* Formulário de Cadastro */}
          <div className="xl:col-span-4">
            <div className="sticky top-28">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/60 p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white text-xl">📝</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Novo Livro</h3>
                    <p className="text-sm text-gray-600">Adicione à sua coleção</p>
                  </div>
                </div>
                <BookForm onBookCreated={handleBookCreated} />
              </div>
            </div>
          </div>

          {/* Lista de Livros */}
          <div className="xl:col-span-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/60 p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white text-xl">📚</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Biblioteca</h3>
                    <p className="text-sm text-gray-600">Gerencie sua coleção</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Atualizado agora</span>
                </div>
              </div>
              <BookList refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t border-gray-200/60">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 mx-auto max-w-4xl shadow-sm border border-gray-200/50">
            <div className="text-center">

              <p className="text-gray-500 font-medium">
                © 2025 BookManager. Desenvolvido com
                <span className="text-red-500 mx-1">❤️</span>
                por Lucas (PereiraLegend)
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
