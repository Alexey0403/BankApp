'use client';

import { apiFetch } from "@/lib/api";
import { toast } from "@/services/toasts/toast";
import { IDeposit, IDepositType } from "@/types/deposit";
import { Slider, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface IOpenDepositModalProps {
    onClose: () => void;
    deposit: IDepositType;
    onCreate: (deposit: IDeposit) => void
};

export const OpenDepositModal: React.FC<IOpenDepositModalProps> = ({ onClose, deposit, onCreate }) => {
    const [months, setMonths] = useState(
        Math.round((deposit.min_months + deposit.max_months) / 2)
    );

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    const handleOpenDeposit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData(e.currentTarget as HTMLFormElement | undefined);
            const depositPayload = {
                deposit_type_id: deposit.id,
                number: formData.get("number_account_from") as string,
                amount: Number(formData.get("amount")),
                months: Number(months),
            };

            const resp = await apiFetch('/Deposit', {
                method: 'POST',
                body: JSON.stringify(depositPayload),
            });

            if (!resp.ok) {
                const errMessage = await resp.text();
                throw new Error(errMessage);
            };

            const newDeposit = await resp.json();
            onCreate(newDeposit);
            toast.success(`You have successfully opened a new ${deposit.name} deposit!`);
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
                    Open new {deposit.name} deposit
                </h3>

                <form 
                    className="flex flex-col gap-4"
                    onSubmit={handleOpenDeposit}
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
                    <div>
                        <Typography gutterBottom>
                            Term: {months} {months === 1 ? 'month' : 'months'}
                        </Typography>
                        <Slider
                            min={deposit.min_months}
                            max={deposit.max_months}
                            step={1}
                            marks
                            onChange={(_, value) => setMonths(value as number)}
                            value={months}
                        />
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
                            type="submit"
                        >
                            Open
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};