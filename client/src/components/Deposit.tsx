'use client';

import { CurrencyImages } from "@/data/currency";
import { depositTypeImage } from "@/data/deposits";
import { IDeposit } from "@/types/deposit";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { TopUpDepositModal } from "./TopUpDepositModal";

interface IDepositProps {
    deposit: IDeposit;
    onTopUp: (id: number, amount: number) => void;
};

export const Deposit: React.FC<IDepositProps>  = ({ deposit, onTopUp }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuWrapperRef = useRef<HTMLDivElement | null>(null);
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);

    const toggleOptionsMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setIsMenuOpen(prev => !prev);
    };

    return (
        <div  className="bg-gray-100 rounded-md p-6 relative">
            <div className="flex items-center justify-between">
                <div className="font-bold">
                    {new Date(deposit.start_date).toLocaleString("ru-RU", {
                        hour12: false,
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}
                    {" - "}
                    {new Date(deposit.end_date).toLocaleString("ru-RU", {
                        hour12: false,
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}
                </div>
                <div className="flex items-center gap-4">
                    <div className="rounded-full bg-gradient-to-br from-[#001f4d] to-[#3fa9f5] backdrop-blur-md p-3 w-fit">
                        <Image
                            src={CurrencyImages[deposit.currency.code as keyof typeof CurrencyImages]}
                            width={32}
                            height={32}
                            alt={deposit.currency.code}   
                            className="object-contain w-8 h-8"
                        />  
                    </div>
                    <div className="rounded-full bg-gradient-to-br from-[#001f4d] to-[#3fa9f5] backdrop-blur-md p-3 w-fit">
                        <Image
                            src={depositTypeImage.find(dt => dt.id === deposit.depositType.id)?.image ?? ''}
                            width={32}
                            height={32}
                            alt={deposit.depositType.name}   
                            className="object-contain w-8 h-8"
                        />  
                    </div>
                    {deposit.depositType.can_add_money && (
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
                                    className="absolute top-18 right-5 w-50 bg-white text-gray-900 rounded-md shadow-lg overflow-hidden z-20"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 text-green-600 transition cursor-pointer"
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            setIsTopUpOpen(true);
                                        }}
                                    >
                                        Top up
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="font-medium flex flex-col gap-2">
                <p>Amount: {deposit.amount}{deposit.currency.symbol}</p>
                <p>Interest rate: {deposit.interest_rate}</p>
                <p>Deposit type: {deposit.depositType.name}</p>
                <p>Length: {new Date(deposit.end_date).getMonth() - new Date(deposit.start_date).getMonth()} {(new Date(deposit.end_date).getMonth() - new Date(deposit.start_date).getMonth()) === 1 ? 'month' : 'months'}</p>
            </div>

            {isTopUpOpen && (
                <TopUpDepositModal
                    onClose={() => setIsTopUpOpen(false)}
                    deposit={deposit}
                    onTopUp={onTopUp}
                />
            )}
        </div>
    );
};