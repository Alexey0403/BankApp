export type ToastType = 'success' | 'error';

export interface IToast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
};