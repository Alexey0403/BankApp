'use client';

import { importPublicKeyFromPem, verifyTransactionSignature } from "@/services/signature/signature.service";
import { toast } from "@/services/toasts/toast";
import { ITransaction } from "@/types/transaction";
import { TextField } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useAuth } from "./auth/AuthContext";

interface IVerifyModalProps {
    onClose: () => void;
    transaction: ITransaction;
};

export const VerifyModal: React.FC<IVerifyModalProps> = ({ onClose, transaction }) => {
    const [publicKey, setPublicKey] = useState('');
    const [status, setStatus] = useState<"NOT_CHECKED" | "FAILED" | "SUCCESS">("NOT_CHECKED");
    const { user } = useAuth();

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    const handleVerifySignature = async () => {
        try {
            const payload = JSON.stringify({
                number_account_from: transaction.accountFrom.number,
                number_account_to: transaction.accountTo.number,
                amount: Number(transaction.amount),
                purpose_text: transaction.purpose_text,
                recipients_name: transaction.recipients_name,
                recipients_surname: transaction.recipients_surname,
            });

            let pKey: CryptoKey;
            try {
                pKey = await importPublicKeyFromPem(publicKey as string);
            } catch (keyErr) {
                setStatus("FAILED");
                return;
            };

            const isVerified = await verifyTransactionSignature(pKey, payload, transaction.signature.signature);

            if (isVerified) {
                setStatus("SUCCESS");
            } else {
                setStatus("FAILED");
            };
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            };
        };
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white flex flex-col rounded-md p-6 h-3/4 w-1/2"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold mb-4">
                    Verify transaction
                </h3>

                <div className="mb-6 flex-1 flex flex-col">
                    <div>
                        <TextField 
                            label="Public key" 
                            variant="outlined" 
                            required
                            value={publicKey}
                            className="w-full"
                            multiline
                            rows={9}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPublicKey(e.target.value)}
                        />
                    </div>

                    <div className="flex h-full justify-center items-center">
                        {
                            status === "SUCCESS" && (
                                <div className="aspect-[841/420] max-h-[150px]">
                                    <DotLottieReact
                                        src="/animations/success.lottie"
                                        autoplay
                                    />
                                </div>
                            )
                        }

                        {
                            status === "FAILED" && (
                                <div className="aspect-[841/420] max-h-[150px]">
                                    <DotLottieReact
                                        src="/animations/error.lottie"
                                        autoplay
                                    />
                                </div>
                            )
                        }
                    </div>
                </div> 

                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-700 cursor-pointer"
                        onClick={onClose}
                    >
                        Close
                    </button>
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer disabled:cursor-not-allowed"
                        onClick={handleVerifySignature}
                        disabled={Boolean(!publicKey && status === "NOT_CHECKED")}
                    >
                        Verify
                    </button>
                </div>
            </div>
        </div>
    );
};