import { Currency } from "./currency";

export interface IDepositType {
    can_add_money: boolean;
    can_close_early: false;
    description: string;
    id: number;
    interest_rate: number;
    max_months: number;
    min_months: number;
    name: string;
};

export interface IDeposit {
    id: number;
    amount: number;
    interest_rate: number;
    is_active: boolean;
    start_date: string;
    end_date: string;
    currency: Currency;
    depositType: IDepositType;
};
