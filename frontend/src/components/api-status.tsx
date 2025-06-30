'use client';

import { useState, useEffect } from 'react';
import { BookService } from '@/services/book-service';

export function ApiStatus() {
    const [isOnline, setIsOnline] = useState<boolean | null>(null);

    useEffect(() => {
        const checkApi = async () => {
            const status = await BookService.checkHealth();
            setIsOnline(status);
        };

        checkApi();
        const interval = setInterval(checkApi, 30000); // Verifica a cada 30 segundos

        return () => clearInterval(interval);
    }, []);

    if (isOnline === null) {
        return (
            <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-md">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                Verificando conexão com a API...
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md ${isOnline
                ? 'text-green-600 bg-green-50'
                : 'text-red-600 bg-red-50'
            }`}>
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
            {isOnline ? '✅ API Online' : '❌ API Offline'}
        </div>
    );
}
