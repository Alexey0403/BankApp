'use client';

import { ITransaction } from "@/types/transaction";
import { useEffect, useRef, useState } from "react";
import { TransactionInfoModal } from "./TransactionInfoModal";
import Image from "next/image";
import { CurrencyImages } from "@/data/currency";
import { VerifyModal } from "./VerifyModal";
import { toast } from "@/services/toasts/toast";
import { apiFetch } from "@/lib/api";
import { ConfirmDialog } from "./ConfirmDialog";

interface ITransactionProps {
    transaction: ITransaction;
    onCancel?: (id: number) => void;
    isAdmin?: boolean;
};

export const Transaction: React.FC<ITransactionProps> = ({ transaction, onCancel, isAdmin = false }) => {
    const [isFullInfoOpen, setIsFullInfoOpen] = useState(false);
    const [isSignatureVerifyOpen, setIsSignatureVerifyOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const menuWrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuWrapperRef.current &&
                !menuWrapperRef.current.contains(e.target as Node)
            ) {
                setIsMenuOpen(false);
            };
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOptionsMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setIsMenuOpen(prev => !prev);
    };

    const handleCancelTransaction = async () => {
        try {
            await apiFetch(`/Transaction/canceltransaction?transactionId=${transaction.id}`, {
                method: 'PUT',
            });
            if (onCancel) {
                onCancel(transaction.id);
                toast.success("You've successfully canceled transaction!");
            };
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            };
        };
    };

    const handleAdminCancelTransaction = async () => {
        try {
            const resp = await apiFetch(`/admin/transactions/canceltransaction?transactionId=${transaction.id}`, { method: 'PUT' });

            if (!resp.ok) {
                const errMessage = await resp.text();
                throw new Error(errMessage);
            };

            if (resp.status !== 401) {
                if (onCancel) {
                    onCancel(transaction.id);
                    toast.success("You've successfully deleted transaction!");
                };
            } else {
                throw new Error('Unauthorized');
            };
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            };
        };
    };

    const handleCancelTransactionModal = () => {
        setIsConfirmOpen(false);
        handleCancelTransaction();
    };

    const handleApproveTransaction = async () => {
        try {
            const resp = await apiFetch(`/admin/transactions/confirmtransaction?transactionId=${transaction.id}`, { method: 'PUT' });

            if (!resp.ok) {
                const errMessage = await resp.text();
                throw new Error(errMessage);
            };

            if (resp.status !== 401) {
                if (onCancel) {
                    onCancel(transaction.id);
                    toast.success("You've successfully approved transaction!");
                };
            } else {
                throw new Error('Unauthorized');
            };
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            };
        };
    };

    return (
        <div className="bg-gray-100 rounded-md p-6 relative">
            <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                    <p>
                        {new Date(transaction.created_at).toLocaleString("ru-RU", {
                            hour12: false,
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                    <p className={
                        `${transaction.status.status === "FAILED" ? 'text-red-600' : transaction.status.status === "PENDING" ? 'text-yellow-600' : 'text-green-600'} font-semibold`
                    }>{transaction.status.status}</p>
                    <p>{transaction.amount}{transaction.accountFrom.currency.symbol}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="rounded-full bg-gradient-to-br from-[#001f4d] to-[#3fa9f5] backdrop-blur-md p-3 w-fit">
                        <Image
                            src={CurrencyImages[transaction.accountFrom.currency.code as keyof typeof CurrencyImages]}
                            width={32}
                            height={32}
                            alt={transaction.accountFrom.currency.code}   
                            className="object-contain w-8 h-8"
                        />  
                    </div>
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
                                className="absolute top-21 right-5 w-50 bg-white text-gray-900 rounded-md shadow-lg overflow-hidden z-20"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100 transition cursor-pointer"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setIsFullInfoOpen(true);
                                    }}
                                >
                                    Full Transaction info
                                </button>
                                {
                                    !isAdmin && (
                                        <button
                                            className="w-full px-4 py-2 text-left hover:bg-gray-100 transition cursor-pointer"
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                setIsSignatureVerifyOpen(true);
                                            }}
                                        >
                                            Check with public key
                                        </button>
                                    )
                                }
                                {
                                    transaction.status.status === "PENDING" && (
                                        <button
                                            className="w-full px-4 py-2 text-left hover:bg-gray-100 transition cursor-pointer text-red-600"
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                setIsConfirmOpen(true);
                                            }}
                                        >
                                            Cancel Transaction
                                        </button>
                                    )
                                }
                                {
                                    transaction.status.status === "PENDING" && isAdmin && (
                                        <button
                                            className="w-full px-4 py-2 text-left hover:bg-gray-100 transition cursor-pointer text-green-600"
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                setIsApproveOpen(true);
                                            }}
                                        >
                                            Approve Transaction
                                        </button>
                                    )
                                }
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isFullInfoOpen && (
                <TransactionInfoModal 
                    onClose={() => setIsFullInfoOpen(false)} 
                    transaction={transaction}
                />
            )}

            {isSignatureVerifyOpen && (
                <VerifyModal 
                    onClose={() => setIsSignatureVerifyOpen(false)} 
                    transaction={transaction}
                />
            )}

            {isConfirmOpen && (
                <ConfirmDialog
                    message="Are you sure you want to cancel transaction?"
                    onConfirm={isAdmin ? handleAdminCancelTransaction : handleCancelTransactionModal}
                    onCancel={() => setIsConfirmOpen(false)}
                />
            )}

            {isApproveOpen && (
                <ConfirmDialog
                    message="Are you sure you want to approve transaction?"
                    onConfirm={handleApproveTransaction}
                    onCancel={() => setIsApproveOpen(false)}
                />
            )}
        </div>
    );
};