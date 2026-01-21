import { Currency } from "./currency";

export interface ITransactionPayload {
    number_account_from: string;
    number_account_to: string;
    amount: number;
    recipients_name: string;
    recipients_surname: string;
    purpose_text: string;
};

export interface ITransaction {
    accountFrom: {
        number: string;
        balance: number;
        currency: Currency;
    },
    accountTo: {
        number: string;
    },
    amount: number;
    created_at: string;
    id: number;
    purpose_text: string;
    recipients_name: string;
    recipients_surname: string;
    status: ITransactionStatus;
    signature: {
        signature: string;
    };
};

interface ITransactionStatus {
    id: number;
    last_change_date: string;
    status: TransactionStatus;
};

type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED";