import { toast } from "@/services/toasts/toast";

export async function copyToClipboard(value: string, successMessage?: string, errorMessage?: string) {
    try {
        const cleanedValue = value.replace(/\s+/g, '');

        await navigator.clipboard.writeText(cleanedValue);
        if (successMessage) toast.success(successMessage);
        return true;
    } catch {
        if (errorMessage) toast.error(errorMessage);
        return false;
    };
};