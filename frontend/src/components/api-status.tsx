'use client';

import { useState, useEffect } from 'react';
import { BookService } from '@/services/book-service';
import { Wifi, WifiOff, Loader2, Server } from 'lucide-react';

export function ApiStatus() {
    const [isOnline, setIsOnline] = useState<boolean | null>(null);

    useEffect(() => {
        const checkApi = async () => {
            const status = await BookService.checkHealth();
            setIsOnline(status);
        };

        checkApi();
        const interval = setInterval(checkApi, 30000);

        return () => clearInterval(interval);
    }, []);

    if (isOnline === null) {
        return (
            <div className="inline-flex items-center gap-3 text-sm bg-white/70 backdrop-blur-sm border border-amber-200 px-4 py-3 rounded-xl shadow-sm">
                <div className="relative">
                    <Server className="w-5 h-5 text-amber-600" />
                    <Loader2 className="w-3 h-3 text-amber-600 animate-spin absolute -top-1 -right-1" />
                </div>
                <div>
                    <div className="font-medium text-amber-800">Verificando Sistema</div>
                    <div className="text-xs text-amber-600">Conectando com a API...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={`inline-flex items-center gap-3 text-sm bg-white/70 backdrop-blur-sm border px-4 py-3 rounded-xl shadow-sm transition-all duration-300 ${isOnline
            ? 'border-green-200 hover:shadow-md'
            : 'border-red-200 hover:shadow-md'
            }`}>
            <div className="relative">
                {isOnline ? (
                    <>
                        <Server className="w-5 h-5 text-green-600" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </>
                ) : (
                    <>
                        <Server className="w-5 h-5 text-red-600" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                    </>
                )}
            </div>
            <div>
                {isOnline ? (
                    <>
                        <div className="font-semibold text-green-800">Sistema Online</div>
                        <div className="text-xs text-green-600 flex items-center gap-1">
                            <Wifi className="w-3 h-3" />
                            API funcionando perfeitamente
                        </div>
                    </>
                ) : (
                    <>
                        <div className="font-semibold text-red-800">Sistema Offline</div>
                        <div className="text-xs text-red-600 flex items-center gap-1">
                            <WifiOff className="w-3 h-3" />
                            Falha na conexão com a API
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
