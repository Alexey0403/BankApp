'use client';

import { Provider } from "@/types/card";
import { useEffect, useState } from "react";

interface CreateCardModalProps {
    onClose: () => void;
    onCreate: (provider: Provider) => void;
};

export const CreateCardModal: React.FC<CreateCardModalProps> = ({ onClose, onCreate }) => {
    const [provider, setProvider] = useState<Provider>('Visa');

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md p-6 w-100">
                <h3 className="text-lg font-semibold mb-4">
                    Create new card
                </h3>

                <div className="mb-6">
                    <p className="mb-2 font-medium">Provider</p>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                checked={provider === 'Visa'}
                                onChange={() => setProvider('Visa')}
                            />
                            Visa
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                checked={provider === 'Mastercard'}
                                onChange={() => setProvider('Mastercard')}
                            />
                            Mastercard
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                checked={provider === 'American Express'}
                                onChange={() => setProvider('American Express')}
                            />
                            American Express
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-700 cursor-pointer"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
                        onClick={() => onCreate(provider)}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};