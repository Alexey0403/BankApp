'use client';

import { useEffect, useState } from 'react';
import { toastStore } from '../../services/toasts/toast.store';
import { ToastContainer } from './ToastContainer';
import { IToast } from '@/types/toast';

interface IToastProviderProps {
    children: React.ReactNode;
};

export const ToastProvider: React.FC<IToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<IToast[]>([]);

    useEffect(() => {
        return toastStore.subscribe(setToasts);
    }, []);

    return (
        <>
            {children}
            <ToastContainer toasts={toasts} />
        </>
    );
};