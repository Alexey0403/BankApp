'use client';

import { depositTypeImage } from "@/data/deposits";
import { apiFetch } from "@/lib/api";
import { toast } from "@/services/toasts/toast";
import { IDeposit, IDepositType } from "@/types/deposit";
import Image from "next/image";
import { useEffect, useState } from "react";
import { OpenDepositModal } from "./OpenDepositModal";

interface IDepositTypesProps {
    onOpen: (deposit: IDeposit) => void;
};

export const DepositTypes: React.FC<IDepositTypesProps> = ({ onOpen }) => {
    const [types, setTypes] = useState<IDepositType[]>([]);
    const [isOpenDepositOpen, setIsOpenDepositOpen] = useState(false);
    const [selectedDeposit, setSelectedDeposit] = useState<IDepositType | null>(null);

    useEffect(() => {
        const getDepositTypes = async () => {
            try {
                const resp = await apiFetch('/DepositType');

                if (!resp.ok) {
                    const errMessage = await resp.text();
                    throw new Error(errMessage);
                };

                const json = await resp.json();
                setTypes(json);
            } catch (err) {
                if (err instanceof Error) {
                    toast.error(err.message);
                };
            };
        };

        getDepositTypes();
    }, []);

    return (
        <section className="container py-10">
            <h2 className="text-[48px]/[120%] font-medium mb-4">Deposits</h2>
            <div className="grid grid-cols-3 grid-rows-2 gap-2">
                {types.map((t, index) => (
                    <div 
                        key={index}
                        className={`
                            w-full min-h-[100px]
                            ${index === 0 ? 'col-span-2' : ''}
                            ${index === 1 ? 'row-span-2' : ''}
                            ${index === 2 ? 'col-span-2' : ''}
                        `}
                    >
                        {
                            index === 0 || index === 2 ? (
                                <div className="flex items-center gap-10 rounded-md w-ful h-full bg-gradient-to-br from-[#001f4d] to-[#3fa9f5] text-white">
                                    <Image
                                        src={depositTypeImage.find(dt => dt.id === t.id)?.image ?? ''}
                                        width={300}
                                        height={300}
                                        alt={t.name}
                                        quality={100}
                                    />
                                    <div className="min-w-[275px] flex flex-col gap-2 text-[18px]/[120%]">
                                        <h3 className="text-[36px]/[120%] font-medium">{t.name} deposit</h3>
                                        <p>Interest rate: {t.interest_rate}%</p>
                                        <p>Min term: {t.min_months} {t.min_months === 1 ? 'month' : 'months'}</p>
                                        <p>Max term: {t.max_months} {t.max_months === 1 ? 'month' : 'months'}</p>
                                        <div className="flex items-center gap-2">
                                            <p>Top up</p>
                                            <Image
                                                src={t.can_add_money ? '/images/success.png' : '/images/error.png'}
                                                alt={t.can_add_money ? 'Yes' : 'No'}
                                                width={20}
                                                height={20}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedDeposit(t);
                                            setIsOpenDepositOpen(true);
                                        }}
                                        className="px-4 py-2 font-semibold bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
                                    >
                                        Open
                                    </button>
                                </div>
                            ) : index === 1 ? (
                                <div className="rounded-md w-full h-full bg-gradient-to-br from-[#001f4d] to-[#3fa9f5] text-white">
                                   <div className="w-full flex flex-col items-center justify-center">
                                        <Image
                                            src={depositTypeImage.find(dt => dt.id === t.id)?.image ?? ''}
                                            width={300}
                                            height={300}
                                            alt={t.name}
                                            quality={100}
                                        />
                                        <div className="flex flex-col gap-2 text-[18px]/[120%] mb-10">
                                            <h3 className="text-[36px]/[120%] font-medium">{t.name} deposit</h3>
                                            <p>Interest rate: {t.interest_rate}%</p>
                                            <p>Min term: {t.min_months} {t.min_months === 1 ? "month" : "months"}</p>
                                            <p>Max term: {t.max_months} {t.max_months === 1 ? 'month' : 'months'}</p>
                                            <div className="flex items-center gap-2">
                                                <p>Top up</p>
                                                <Image
                                                    src={t.can_add_money ? '/images/success.png' : '/images/error.png'}
                                                    alt={t.can_add_money ? 'Yes' : 'No'}
                                                    width={20}
                                                    height={20}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedDeposit(t);
                                                setIsOpenDepositOpen(true);
                                            }}
                                            className="px-4 py-2 bg-green-600 font-semibold text-white rounded-md hover:bg-green-700 cursor-pointer"
                                        >
                                            Open
                                        </button>
                                   </div>
                                </div>
                            ) : null
                        }
                    </div>
                ))}
            </div>

            {isOpenDepositOpen && (
                <OpenDepositModal
                    onClose={() => {
                        setIsOpenDepositOpen(false);
                        setSelectedDeposit(null);
                    }}
                    onCreate={onOpen}
                    deposit={selectedDeposit!}
                />
            )}
        </section>
    );
};