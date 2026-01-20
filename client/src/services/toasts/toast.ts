import { ToastType } from '@/types/toast';
import { toastStore } from './toast.store';

function createToast(type: ToastType, message: string, duration = 10000) {
    const id = crypto.randomUUID();

    toastStore.add({ id, type, message, duration });

    setTimeout(() => {
        toastStore.remove(id);
    }, duration);
}

export const toast = {
    success: (msg: string, duration?: number) =>
        createToast('success', msg, duration),

    error: (msg: string, duration?: number) =>
        createToast('error', msg, duration),
};