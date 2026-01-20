import { Dayjs } from "dayjs";

export interface ProfileForm {
    name: string;
    surname: string;
    birthday: Dayjs | null;
    phone: string;
    email: string;
};