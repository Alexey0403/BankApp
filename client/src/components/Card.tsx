'use client';

import { ProviderImages } from "@/data/provider";
import { maskNumber } from "@/helpers/cardNumber.helper";
import { copyToClipboard } from "@/helpers/clipboard.helper";
import { ICard } from "@/types/card";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import { toast } from "@/services/toasts/toast";
import { apiFetch } from "@/lib/api";

interface ICardProps {
    card: ICard;
    acc_is_active: boolean;
};

export const Card: React.FC<ICardProps> = ({ card, acc_is_active }) => {
    const { number, month, year, cvv, card_provider_id, is_active } = card;

    const [isNumberShown, setIsNumberShown] = useState(false);
    const [isCvvShown, setIsCvvShown] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuWrapperRef = useRef<HTMLDivElement | null>(null);
    const [cardIsActive, setCardIsActive] = useState(is_active);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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

    const chunks = maskNumber(number, isNumberShown);

    const toggleCardNumberVisibility = async () => {
        setIsNumberShown(prev => {
            if (!prev) copyToClipboard(
                number, 
                "The card number has been successfully copied to the clipboard!",
                "An error occurred while copying the card number!"
            );

            return !prev;
        });
    };

    const toggleCvvVisibility = () => {
        setIsCvvShown(prev => {
            if (!prev) copyToClipboard(
                number, 
                "The card CVV has been successfully copied to the clipboard!",
                "An error occurred while copying the card CVV!"
            );

            return !prev;
        });
    };

    const toggleOptionsMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setIsMenuOpen(prev => !prev);
    };

    const handleDeactivateCard = async () => {
        try {
            const resp = await apiFetch(`/Card/${card.id}/close`, { method: 'PUT' });

            if (resp.status !== 401) {
                setCardIsActive(prev => !prev);
                setIsConfirmOpen(false);
                toast.success("You've successfully deactivated your card!");
            } else {
                throw new Error('Unauthorized')
            };
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            };
        };
    };

    const handleReactivateCard = async () => {
        try {
            const resp = await apiFetch(`/Card/${card.id}/reopen`, { method: 'PUT' });

            if (resp.status !== 401) {
                setCardIsActive(prev => !prev);
                setIsConfirmOpen(false);
                toast.success("You've successfully reactivated your card!");
            } else {
                throw new Error('Unauthorized');
            };
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            };
        }
    };

    const getCardProviderById = (card_provider_id: number) => {
        switch (card_provider_id) {
            case 1:
                return "Visa";
            case 2:
                return "Mastercard";
            case 3:
                return "American Express"
            default:
                return "Visa";
        };
    };

    useEffect(() => {
        setCardIsActive(card.is_active);
    }, [card.is_active]);

    return (
        <div className="relative flex flex-col gap-8 max-w-fit bg-gradient-to-br from-[#001f4d] to-[#3fa9f5] text-white rounded-md p-4 snap-start shrink-0">
            <div className="flex items-center justify-between">
                <div className="rounded-md bg-white/20 backdrop-blur-md p-3 w-fit">
                    <Image
                        src="/images/logo.webp"
                        width={100}
                        height={40}
                        alt="Logo"
                    />
                </div>
                { acc_is_active && (
                    <div
                        onClick={toggleOptionsMenu}
                        ref={menuWrapperRef}
                        className="p-3 flex items-center justify-center rounded-full hover:bg-white/20 transition cursor-pointer"
                    >
                        <Image
                            src="/images/dots.png"
                            width={20}
                            height={20}
                            alt="Options"
                            className="object-contain"
                        />

                        {isMenuOpen && (
                            <div
                                className="absolute top-15 right-3 w-44 bg-white text-gray-900 rounded-md shadow-lg overflow-hidden z-20 opacity-100 filter-none"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {
                                    cardIsActive && (
                                        <button
                                            className="w-full px-4 py-2 text-left hover:bg-gray-100 transition cursor-pointer"
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                copyToClipboard(
                                                    number, 
                                                    "The card number has been successfully copied to the clipboard!",
                                                    "An error occurred while copying the card number!"
                                                );
                                            }}
                                        >
                                            Copy card number
                                        </button>
                                    )
                                }

                                <button
                                    className={`w-full px-4 py-2 text-left ${cardIsActive ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"} transition cursor-pointer`}
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setIsConfirmOpen(true);
                                    }}
                                >
                                    {cardIsActive ? 'Deactivate card' : 'Reactivate card'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div 
                className="px-20 cursor-pointer flex items-center gap-4 font-medium"
                onClick={toggleCardNumberVisibility}
            >
                {cardIsActive ? chunks.map((c, index) => (
                    <p 
                        key={index}
                        className="w-9 text-center"
                    >{c}</p>
                )) : (
                    <p className="text-red-600 w-48 text-center">DEACTIVATED</p>
                )}
            </div>
            <div className="flex items-center justify-between"> 
                <div className="rounded-md bg-white/20 backdrop-blud-md p-3">
                    <Image
                        src={ProviderImages[getCardProviderById(card_provider_id)]}
                        width={50}
                        height={20}
                        alt={getCardProviderById(card_provider_id)}
                    />
                </div>
                <p className="font-medium">{month}/{year}</p>
                <div 
                    className="rounded-md bg-white/20 backdrop-blud-md p-3 cursor-pointer font-medium"
                    onClick={toggleCvvVisibility}
                >
                    <p className="w-8 text-center">{isCvvShown ? cvv : "CVV"}</p>
                </div>
            </div>

            {isConfirmOpen && (
                <ConfirmDialog
                    message={cardIsActive ? "Are you sure you want to deactivate the card?" : "Are you sure you want to reactivate the card?"}
                    onConfirm={cardIsActive ? handleDeactivateCard : handleReactivateCard}
                    onCancel={() => setIsConfirmOpen(false)}
                />
            )}
        </div>
    );
};