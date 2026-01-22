'use client';

import { apiFetch } from "@/lib/api";
import { toast } from "@/services/toasts/toast";
import { IDeposit } from "@/types/deposit";
import { TextField } from "@mui/material";
import { useEffect } from "react";

interface ITopUpDepositModalProps {
    onClose: () => void;
    deposit: IDeposit;
    onTopUp: (id: number, amount: number) => void;
};

export const TopUpDepositModal: React.FC<ITopUpDepositModalProps> = ({ onClose, deposit, onTopUp }) => {
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    const handleTopUpDeposit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData(e.currentTarget as HTMLFormElement | undefined);
            const depositTopUpPayload = {
                number: formData.get("number_account_from") as string,
                amount: Number(formData.get("amount")),
            };

            const resp = await apiFetch(`/Deposit/${deposit.id}/add-money`, {
                method: 'PUT',
                body: JSON.stringify(depositTopUpPayload),
            });

            if (!resp.ok) {
                const errMessage = await resp.text();
                throw new Error(errMessage);
            };
            
            onTopUp(deposit.id, depositTopUpPayload.amount);
            toast.success(`You have successfully topped up your deposit!`);
            onClose();  
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            };
        };
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md p-6 w-100">
                <h3 className="text-lg font-semibold mb-4">
                    Top Up deposit
                </h3>

                <form 
                    className="flex flex-col gap-4"
                    onSubmit={handleTopUpDeposit}
                >
                    <TextField
                        name="number_account_from"
                        label="Account from"
                        variant="outlined"
                        required
                        placeholder="Account from placeholder"
                    />
                    <TextField
                        name="amount"
                        label="Amount"
                        type="number"
                        variant="outlined"
                        required
                        placeholder="100"
                    />

                    <div className="flex justify-end gap-3">
                        <button
                            className="px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-700 cursor-pointer"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
                            type="submit"
                        >
                            Top Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};