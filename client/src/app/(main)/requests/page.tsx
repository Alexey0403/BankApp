'use client';

import { AdminAccounts } from "@/components/AdminAccounts";
import { AdminTransactions } from "@/components/AdminTransactions";
import { useAuth } from "@/components/auth/AuthContext";
import { Greetings } from "@/components/Greetings";

export default function Requests() {
    const { loading } = useAuth();

    if (loading) {
        return null;
    };

    return (
        <div className="w-full h-full">
        <Greetings lowerText="Here you will find admin information about user requests." />
        <AdminAccounts />
        <AdminTransactions />
        </div>
    );
};
