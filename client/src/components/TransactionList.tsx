'use client';

import { apiFetch } from "@/lib/api";
import { toast } from "@/services/toasts/toast";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CreateTransactionModal } from "./CreateTransactionModal";
import { ITransaction } from "@/types/transaction";
import { Transaction } from "./Transaction";

export const TransactionList: React.FC = () => {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuWrapperRef = useRef<HTMLDivElement | null>(null);
    const [isCreateTransactionOpen, setIsCreateTransactionOpen] = useState(false);

    useEffect(() => {
        const getTransactions = async () => {
            try {
                const resp = await apiFetch('/Transaction/mytransactions');

                if (!resp.ok) {
                    const errMessage = await resp.text();
                    throw new Error(errMessage);
                };

                const transactionResp = await resp.json();

                setTransactions(transactionResp);
            } catch (err) { 
                if (err instanceof Error) {
                    toast.error(err.message);
                };
            };
        };

        getTransactions();
    }, []);

    const toggleOptionsMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setIsMenuOpen(prev => !prev);
    };

    const handleCreateTransaction = (transaction: ITransaction) => {
        setTransactions([transaction, ...transactions]);
    };

    const handleCancelTransaction = (id: number) => {
        setTransactions(prev => prev.map(t => { 
            if (t.id === id) {
                t.status.status = "FAILED";
                return t;
            };
            return t;
        }));
    };

    return (
        <section className="container py-10 relative">
            <div className="flex items-center justify-between">
                <h2 className="text-[48px]/[120%] font-medium mb-4">Transactions</h2>
                <div
                    onClick={toggleOptionsMenu}
                    ref={menuWrapperRef}
                    className="flex items-center justify-center cursor-pointer"
                >
                    <Image
                        src="/images/dots-black.png"
                        width={20}
                        height={20}
                        alt="Options"
                        className="object-contain"
                    />

                    {isMenuOpen && (
                        <div
                            className="absolute top-22 right-0 w-60 bg-white text-gray-900 rounded-md shadow-lg overflow-hidden z-20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 transition cursor-pointer"
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    setIsCreateTransactionOpen(true);
                                }}
                            >
                                Create new transaction
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {transactions.map((transaction => (
                    <Transaction 
                        key={transaction.id}
                        transaction={transaction}
                        onCancel={handleCancelTransaction}
                    />
                )))}
            </div>

            {isCreateTransactionOpen && (
                <CreateTransactionModal
                    onClose={() => setIsCreateTransactionOpen(false)}
                    onCreate={handleCreateTransaction}
                />
            )}
        </section>
    );
};