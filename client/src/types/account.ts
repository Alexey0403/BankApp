import { ICard } from "./card";
import { Currency } from "./currency";

export interface IAccount {
    id: number;
    number: string;
    currency: Currency;
    balance: number;
    cards: ICard[];
    is_active: boolean;
};