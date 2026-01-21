'use client';

import { CurrencyImages } from "@/data/currency";
import { copyToClipboard } from "@/helpers/clipboard.helper";
import { IAccount } from "@/types/account";
import Image from "next/image";
import { Card } from "./Card";
import { useEffect, useRef, useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import { toast } from "@/services/toasts/toast";
import { Provider } from "@/types/card";
import { CreateCardModal } from "./CreateCardModal";
import { apiFetch } from "@/lib/api";

interface IAccountProps {
    account: IAccount;
    isAdmin?: boolean;
    handleDelete?: (id: number) => void;
};

export const Account: React.FC<IAccountProps> = ({ account, isAdmin = false, handleDelete }) => {
    const { number, currency, cards, balance, is_active } = account;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuWrapperRef = useRef<HTMLDivElement | null>(null);
    const [accountIsActive, setAccountIsActive] = useState(is_active);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isCreateCardOpen, setIsCreateCardOpen] = useState(false);
    const [accountCards, setAccountCards] = useState(cards ?? []);

    const handleAccountNumberClick = (number: string) => {
        copyToClipboard(
            number,
            "The account number has been successfully copied to the clipboard!",
            "An error occurred while copying the account number!"
        );
    };

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

    const handleCreateCard = async (provider: Provider) => {
        try {
            const resp = await apiFetch('/Card', {
                method: 'POST',
                body: JSON.stringify({
                    account_id: account.id,
                    card_provider_id: provider === 'Visa' ? 1 : provider === 'Mastercard' ? 2 : 3
                })
            });

            if (!resp.ok) {
                const errMessage = await resp.text();
                throw new Error(errMessage);
            };

            const newCard = await resp.json();

            setAccountCards(prev => [newCard, ...prev]);
            setIsCreateCardOpen(false);

            toast.success('New card successfully created!');
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            };
        };
    };

    const handleDeactiveAccount = async () => {
        try {
            const resp = await apiFetch(`/Account/${account.id}/close`, { method: 'PUT' });

            if (!resp.ok) {
                const errMessage = await resp.text();
                throw new Error(errMessage);
            };

            if (resp.status !== 401) {
                setAccountIsActive(prev => !prev);
                setAccountCards(prev => prev.map(c => ({
                    ...c,
                    is_active: false
                })));
                setIsConfirmOpen(false);
                toast.success("You've successfully deactivated your account!");
            } else {
                throw new Error('Unauthorized');
            };
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            };
        }
    };

    const handleReactivateAccount = async () => {
        try {
            const resp = await apiFetch(`/Account/${account.id}/reopen`, { method: 'PUT' });

            if (!resp.ok) {
                const errMessage = await resp.text();
                throw new Error(errMessage);
            };

            if (resp.status !== 401) {
                setAccountIsActive(prev => !prev);
                setIsConfirmOpen(false);
                toast.success("You've successfully reactivated your account!");
            } else {
                throw new Error('Unauthorized');
            };
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            };
        };  
    };

    const handleDeleteAccount = async () => {
        try {
            const resp = await apiFetch(`/admin/accounts/${account.id}`, { method: 'DELETE' });

            if (!resp.ok) {
                const errMessage = await resp.text();
                throw new Error(errMessage);
            };

            if (resp.status !== 401) {
                if (handleDelete) {
                    handleDelete(account.id);
                    setIsConfirmOpen(false);
                    toast.success("You've successfully deleted the account!");
                };
            } else {
                throw new Error('Unauthorized');
            };;
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            };
        };
    };

    return (
        <div  className="bg-gray-100 rounded-md p-6 relative">
            <div className={`${accountCards.length !== 0 && 'mb-4'} flex justify-between`}>
                <div>
                    <h3 className="mb-2">   
                        Number:
                        <span 
                            className="font-medium cursor-pointer"
                            onClick={() => handleAccountNumberClick(number)}
                        > {number}</span>
                    </h3>
                    <h4 className="mb-2">Balance: <span className="font-medium">{balance} 
                        {` ${currency.code}`}
                        </span>
                    </h4>
                    <h5>
                        Status: <span 
                            className={`font-medium ${accountIsActive ? 'text-green-600' : 'text-red-600'}`}
                        > {accountIsActive ? "Active" : "Disabled"}</span>
                    </h5>
                </div>
                <div className="flex items-center gap-4">
                    <div className="rounded-full bg-gradient-to-br from-[#001f4d] to-[#3fa9f5] backdrop-blur-md p-3 w-fit">
                        <Image
                            src={CurrencyImages[currency.code as keyof typeof CurrencyImages]}
                            width={32}
                            height={32}
                            alt={currency.code}   
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
                            isAdmin ? (
                                <div
                                    className="absolute top-21 right-5 w-50 bg-white text-gray-900 rounded-md shadow-lg overflow-hidden z-20"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 transition cursor-pointer text-red-600 hover:bg-red-50"
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            setIsConfirmOpen(true);
                                        }}
                                    >
                                        Delete account
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className="absolute top-21 right-5 w-50 bg-white text-gray-900 rounded-md shadow-lg overflow-hidden z-20"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {accountIsActive && (
                                        <div>
                                            <button
                                                className="w-full px-4 py-2 text-left hover:bg-gray-100 transition cursor-pointer"
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    copyToClipboard(
                                                        number, 
                                                        "The account number has been successfully copied to the clipboard!",
                                                        "An error occurred while copying the account number!"
                                                    );
                                                }}
                                            >
                                                Copy account number
                                            </button>
                                            <button
                                                className="w-full px-4 py-2 text-left hover:bg-gray-100 transition cursor-pointer"
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    setIsCreateCardOpen(true);
                                                }}
                                            >
                                                Create new card
                                            </button>
                                        </div>
                                    )}
                                    <button
                                        className={`w-full px-4 py-2 text-left ${accountIsActive ? "text-red-600 hover:bg-red-50" : "text-green-600"} transition cursor-pointer`}
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            setIsConfirmOpen(true);
                                        }}
                                    >
                                        {accountIsActive ? 'Deactivate account' : 'Reactivate account'}
                                    </button>
                                </div>
                            )

                        )}
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth rounded-md">
                <div className="flex items-center gap-10">
                    {accountCards.map(card => (
                        <Card 
                            key={card.number}
                            card={card}
                            acc_is_active={accountIsActive}
                            isAdmin={isAdmin}
                            handleDelete={(id: number) => setAccountCards(prev => prev.filter(c => c.id !== id))}
                        />
                    ))}
                </div>
            </div>

            {isConfirmOpen && (
                <ConfirmDialog
                    message={isAdmin ? "Are you sure you want to delete the account?" : accountIsActive ? "Are you sure you want to deactivate the account?" : "Are you sure you want to reactivate the account?"}
                    onConfirm={isAdmin ? handleDeleteAccount : accountIsActive ? handleDeactiveAccount : handleReactivateAccount}
                    onCancel={() => setIsConfirmOpen(false)}
                />
            )}

            {isCreateCardOpen && (
                <CreateCardModal
                    onClose={() => setIsCreateCardOpen(false)}
                    onCreate={handleCreateCard}
                />
            )}
        </div>
    );
};  