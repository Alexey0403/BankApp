'use client';

import { apiFetch } from "@/lib/api";
import { toast } from "@/services/toasts/toast";
import { IAccount } from "@/types/account";
import { useEffect, useState } from "react";
import { Account } from "./Account";

export const AdminAccounts: React.FC = () => {
    const [accounts, setAccounts] = useState<IAccount[]>([]);

    useEffect(() => {
        const getAccounts = async () => {
            try {
                const resp = await apiFetch('/admin/accounts?status=false');
                
                if (resp.ok) {
                    const json = await resp.json();
                    setAccounts(json as IAccount[]);
                } else {
                    const errMessage = await resp.text();
                    throw new Error(errMessage);
                };
            } catch (err) {
                if (err instanceof Error) {
                    toast.error(err.message);
                };
            };
        };

        getAccounts();
    }, []);

    return (
        <section className="container py-10 relative mb-6">
            <h2 className="text-[48px]/[120%] font-medium mb-4">Accounts</h2>
             <div className="flex flex-col gap-6">
                {accounts.map((account => (
                    <Account 
                        key={account.number}
                        account={account}
                        isAdmin
                        handleDelete={(id: number) => setAccounts(prev => prev.filter(a => a.id !== id))}
                    />
                )))}
            </div>
        </section>
    );
};