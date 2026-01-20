import { IToast } from '@/types/toast';
import { ToastImages, ToastStyles } from '@/data/toast';
import Image from 'next/image';
import { toastStore } from '@/services/toasts/toast.store';

interface IToastItemProps {
    toast: IToast;
};

export const ToastItem: React.FC<IToastItemProps> = ({ toast }) => {
    const { type, message, id } = toast;

    return (
        <div
            className={`
                ${ToastStyles[type]}
                flex items-center justify-between gap-4 min-w-[260px] rounded-md px-4 py-3 text-white shadow-lg animate-slide-in
            `}
        >
            <div className='flex items-center gap-4'>
                <Image
                    src={ToastImages[type]}
                    width={20}
                    height={20}
                    alt={type}
                    className='backdrop-blur-md'
                />
                <span>{message}</span>
            </div>

            <button
                onClick={() => toastStore.remove(id)}
                className="opacity-70 hover:opacity-100 cursor-pointer"
            >
                ✕
            </button>
        </div>
    );
};