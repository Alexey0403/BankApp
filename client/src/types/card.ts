export interface ICard {
    id: number;
    number: string;
    month: string;
    year: string;
    cvv: string;
    card_provider_id: number;
    is_active: boolean;
};

export type Provider = "Visa" | "Mastercard" | "American Express";