'use client';

import { BookOpen, Library, Database, Zap } from 'lucide-react';

interface HeaderProps {
    booksCount: number;
}

export function Header({ booksCount }: HeaderProps) {
    return (
        <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-6 py-5">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg">
                                <Library className="w-7 h-7 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                <Zap className="w-2 h-2 text-white" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                                BookManager Pro
                            </h1>
                            <p className="text-sm text-gray-500 font-medium">Sistema de Gestão Bibliográfica</p>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-3 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            <div className="text-right">
                                <div className="text-lg font-bold text-blue-900">{booksCount}</div>
                                <div className="text-xs text-blue-600 font-medium">
                                    Livro{booksCount !== 1 ? 's' : ''}
                                </div>
                            </div>
                        </div>

                        {/* Status da API */}
                        <div className="hidden md:flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                            <Database className="w-5 h-5 text-green-600" />
                            <div className="text-right">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-semibold text-green-900">Online</span>
                                </div>
                                <div className="text-xs text-green-600 font-medium">API Ativa</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
