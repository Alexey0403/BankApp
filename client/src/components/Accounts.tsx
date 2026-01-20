'use client';

import { useEffect, useRef, useState } from "react";
import { Account } from "./Account";
import Image from "next/image";
import { Currency } from "@/types/currency";
import { IAccount } from "@/types/account";
import { CreateAccountModal } from "./CreateAccountModal";
import { apiFetch } from "@/lib/api";
import { toast } from "@/services/toasts/toast";

export const Accounts: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuWrapperRef = useRef<HTMLDivElement | null>(null);
    const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
    const [accountsList, setAccountsList] = useState<IAccount[]>([]);

    useEffect(() => {
        const getAccounts = async () => {
            try {
                const res = await apiFetch('/Account/user/myaccounts');
                if (res.status === 404) {
                    setAccountsList([]);
                } else {
                    const json = await res.json();
                    json.map(async (a: IAccount) => {
                        const cardsRes = await apiFetch(`/Card/account/${a.id}`);
                        if (cardsRes.status === 404) {
                            a.cards = [];
                        } else {
                            const cardsJson = await cardsRes.json();
                            a.cards = cardsJson;
                        };
                    })
                    setAccountsList(json);
                }
            } catch (err) {
                console.error(err);
            };
        };

        getAccounts();
    }, []);

    const toggleOptionsMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setIsMenuOpen(prev => !prev);
    };

    const handleCreateAccount = async (currency: Currency) => {
        try {
             const res = await apiFetch('/Account', {
                method: 'POST',
                body: JSON.stringify({
                    currency_id: currency.id
                })
            });

            const newAccount = await res.json();

            setAccountsList(prev => [newAccount, ...prev]);
            setIsCreateAccountOpen(false);

            toast.success("New account was successfully created!");
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            };
        };
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuWrapperRef.current &&
                !menuWrapperRef.current.contains(e.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <section className="container py-10 relative">
            <div className="flex items-center justify-between">
                <h2 className="text-[48px]/[120%] font-medium mb-4">Accounts</h2>
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
                            className="absolute top-22 right-0 w-50 bg-white text-gray-900 rounded-md shadow-lg overflow-hidden z-20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 transition cursor-pointer"
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    setIsCreateAccountOpen(true);
                                }}
                            >
                                Create new account
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {accountsList.map((account => (
                    <Account 
                        key={account.number}
                        account={account}
                    />
                )))}
            </div>

            {isCreateAccountOpen && (
                <CreateAccountModal
                    onClose={() => setIsCreateAccountOpen(false)}
                    onCreate={handleCreateAccount}
                />
            )}
        </section>
    );
};