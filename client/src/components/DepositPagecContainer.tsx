'use client';

import { apiFetch } from "@/lib/api";
import { toast } from "@/services/toasts/toast";
import { useEffect, useState } from "react";
import { DepositTypes } from "./DepositTypes";
import { Deposits } from "./Deposits";
import { IDeposit } from "@/types/deposit";

export const DepositPageContainer: React.FC = () => {
    const [deposits, setDeposits] = useState<IDeposit[]>([]);

    useEffect(() => {
        const getDeposits = async () => {
            try {
                const resp = await apiFetch('/Deposit/mydeposits');

                if (!resp.ok) {
                    const errMessage = await resp.text();
                    throw new Error(errMessage);
                };

                const json = await resp.json();
                setDeposits(json);
            } catch (err) {
                if (err instanceof Error) {
                    toast.error(err.message);
                };
            };
        };

        getDeposits();
    }, []);

    const handleDepositOpen = (deposit: IDeposit) => setDeposits(prev => [deposit, ...prev]);

    const handleTopUpDeposit = (id: number, amount: number) => {
        setDeposits(prev =>
            prev.map(d =>
                d.id === id
                    ? { ...d, amount: d.amount + amount }
                    : d
            )
        );
    };

    return (
        <>
            <DepositTypes onOpen={handleDepositOpen} />
            <Deposits 
                deposits={deposits} 
                onTopUp={handleTopUpDeposit}
            />
        </>
    );
};