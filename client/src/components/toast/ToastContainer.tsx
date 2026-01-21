import { IToast } from '@/types/toast';
import { ToastItem } from './ToastItem';

interface IToastContainerProps {
    toasts: IToast[];
};

export const ToastContainer: React.FC<IToastContainerProps> = ({ toasts }) => {
    return (
        <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>
    );
};