import dayjs, { Dayjs } from "dayjs";

export function backendDateToDayjs(value?: string): Dayjs | null {
    if (!value) return null;

    const [year, month, day] = value.split("-");
    return dayjs(`${year}-${month}-${day}`);
}