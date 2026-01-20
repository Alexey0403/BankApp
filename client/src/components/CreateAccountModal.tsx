'use client';

import { apiFetch } from "@/lib/api";
import { Currency } from "@/types/currency";
import { useEffect, useState } from "react";

interface CreateAccountModalProps {
    onClose: () => void;
    onCreate: (currency: Currency) => void;
};

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
    onClose,
    onCreate,
}) => {
    const [currencyList, setCurrencyList] = useState<Currency[]>([]);
    const [currency, setCurrency] = useState<Currency | null>(null);

    useEffect(() => {
        const getCurrencyList = async () => {
            try {
                const res = await apiFetch('/Currency');
                const json = await res.json();
                setCurrencyList(json);
            } catch (err) {
                console.error(err);
            };
        };
        
        getCurrencyList();
    }, []);

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-md p-6 w-96"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold mb-4">
                    Create new account
                </h3>

                <div className="mb-6">
                    <p className="mb-2 font-medium">Currency</p>
                    <div className="flex flex-col gap-3">
                        {currencyList.map(curr => (
                            <label
                                key={curr.code}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    checked={currency?.code === curr.code}
                                    onChange={() => setCurrency(curr)}
                                />
                                {curr.code}
                            </label>
                        ))}
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
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer disabled:cursor-not-allowed"
                        onClick={() => onCreate(currency!)}
                        disabled={!currency}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};