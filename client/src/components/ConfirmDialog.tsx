'use client';

import { useEffect } from "react";

interface IConfirmDialogProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export const ConfirmDialog: React.FC<IConfirmDialogProps> = ({ message, onConfirm, onCancel }) => {
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    return (
        <div  
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            onClick={onCancel}
        >
            <div 
                className="bg-white rounded-md p-6 w-80"
                onClick={e => e.stopPropagation()}
            >
                <p className="mb-4 text-black">{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-700 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};