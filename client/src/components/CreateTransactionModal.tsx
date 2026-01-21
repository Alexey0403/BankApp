'use client';

import { apiFetch } from "@/lib/api";
import { importPrivateKeyFromPem, signTransaction } from "@/services/signature/signature.service";
import { toast } from "@/services/toasts/toast";
import { ITransaction, ITransactionPayload } from "@/types/transaction";
import { TextField } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

interface ICreateTransactionModalProps {
    onClose: () => void;
    onCreate: (transaction: ITransaction) => void;
};

export const CreateTransactionModal: React.FC<ICreateTransactionModalProps> = ({ onClose, onCreate }) => {
    const [privateKeyPem, setPrivateKeyPem] = useState<string | null>(null);

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    const handlePrivateKeyUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setPrivateKeyPem(reader.result as string);
        };
        reader.readAsText(file);
    };

    const createTransactionPayload = (data: ITransactionPayload) => {
        return JSON.stringify(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!privateKeyPem) {
            toast.error("Private key is required");
            return;
        };

        try {
            const formData = new FormData(e.currentTarget as HTMLFormElement | undefined);
            const transaction = {
                number_account_from: formData.get("number_account_from") as string,
                number_account_to: formData.get("number_account_to") as string,
                amount: Number(formData.get("amount")),
                purpose_text: formData.get("purpose_text") as string,
                recipients_name: formData.get("recipients_name") as string,
                recipients_surname: formData.get("recipients_surname") as string,
                created_at: new Date().toISOString()
            };
            const { created_at, ...transactionWithoutDate } = transaction;
            const payload = createTransactionPayload(transactionWithoutDate);
            const privateKey = await importPrivateKeyFromPem(privateKeyPem);
            const signature = await signTransaction(privateKey, payload);

            const resp = await apiFetch('/Transaction', {
                method: 'POST',
                body: JSON.stringify({
                    ...transaction,
                    signature
                })
            });

            const newTransaction = await resp.json();
            onCreate(newTransaction);
            
            onClose();
            toast.success('Transaction was successfully created!');
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            };
        };
    };

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
                    Create new transaction
                </h3>
                
                <form className="flex flex-col gap-4 mb-4" onSubmit={handleSubmit}>
                    <TextField
                        name="number_account_from"
                        label="Account from"
                        variant="outlined"
                        required
                        placeholder="Account from placeholder"
                    />
                    <TextField
                        name="number_account_to"
                        label="Account to"
                        variant="outlined"
                        required
                        placeholder="Account to placeholder"
                    />
                    <TextField
                        name="amount"
                        label="Amount"
                        type="number"
                        variant="outlined"
                        required
                        placeholder="100"
                    />
                    <TextField
                        name="recipients_name"
                        label="Recipient name"
                        variant="outlined"
                        required
                        placeholder="=John"
                    />
                    <TextField
                        name="recipients_surname"
                        label="Recipient surname"
                        variant="outlined"
                        required
                        placeholder="Doe"
                    />
                    <TextField
                        name="purpose_text"
                        label="Purpose"
                        variant="outlined"
                        multiline
                        rows={2}
                        placeholder="Purpose placeholder"
                    />
                    <input type="file" accept=".pem" required onChange={handlePrivateKeyUpload} />

                    <div className="flex justify-end gap-3">
                        <button
                            className="px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-700 cursor-pointer"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer disabled:cursor-not-allowed"
                            type="submit"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};