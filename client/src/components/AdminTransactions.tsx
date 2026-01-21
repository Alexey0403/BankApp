'use client';

import { apiFetch } from "@/lib/api";
import { toast } from "@/services/toasts/toast";
import { ITransaction } from "@/types/transaction";
import { Box, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Transaction } from "./Transaction";

export const AdminTransactions: React.FC = () => {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [loading, setLoading] = useState(false);

    const statusIds = [1, 2];

    const fetchTransactions = async (statusId: number) => {
        setLoading(true);
        try {
            const resp = await apiFetch(`/admin/transactions?statusId=${statusId}`);
            if (resp.ok) {
                const json = await resp.json();
                setTransactions(json as ITransaction[]);
            } else {
                const errMessage = await resp.text();
                throw new Error(errMessage);
            };
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            }
        } finally {
            setLoading(false);
        };
    };

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    useEffect(() => {
        fetchTransactions(statusIds[selectedTab]);
    }, [selectedTab]);

    return (
        <div className="container">
            <h2 className="text-[48px]/[120%] font-medium mb-4">Transactions</h2>

            <Tabs value={selectedTab} onChange={handleTabChange}>
                <Tab label="PENDING" />
                <Tab label="SUCCESS" />
            </Tabs>

            <div className="py-4">
                {loading ? (
                    <CircularProgress />
                ) : transactions.length === 0 ? (
                    <Typography>No transactions found</Typography>
                ) : (
                    <div className="flex flex-col gap-4 mb-6">
                        {transactions.map(t => (
                            <Transaction
                                key={t.id}
                                transaction={t}
                                isAdmin
                                onCancel={(id: number) => setTransactions(prev => prev.filter(t => t.id !== id))}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};