'use client';

import { ITransaction } from "@/types/transaction";
import { TextField } from "@mui/material";
import { ChangeEvent, useEffect } from "react";

interface ITransactionInfoModalProps {
    onClose: () => void;
    transaction: ITransaction;
};

export const TransactionInfoModal: React.FC<ITransactionInfoModalProps> = ({ onClose, transaction }) => {
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
                    Transaction info
                </h3>

                <div className="flex flex-col gap-4 mb-4 pointer-events-none">
                    <TextField
                        label="Account from"
                        variant="outlined"
                        value={transaction.accountFrom.number}
                    />
                    <TextField
                        label="Account to"
                        variant="outlined"
                        value={transaction.accountTo.number}
                    />
                    <TextField
                        label="Amount"
                        variant="outlined"
                        value={transaction.amount}
                    />
                    <TextField
                        label="Currency"
                        variant="outlined"
                        value={transaction.accountFrom.currency.code}
                    />
                    <TextField
                        label="Recipients name"
                        variant="outlined"
                        value={transaction.recipients_name}
                    />
                    <TextField
                        label="Recipients surname"
                        variant="outlined"
                        value={transaction.recipients_surname}
                    />
                    <TextField
                        label="Purpose text"
                        variant="outlined"
                        value={transaction.purpose_text}
                    />
                    <TextField
                        label="Status"
                        variant="outlined"
                        value={transaction.status.status}
                    />
                </div>

                 <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-700 cursor-pointer"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};