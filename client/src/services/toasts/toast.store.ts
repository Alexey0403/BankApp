import { MAX_TOASTS } from "@/data/toast";
import { IToast } from "@/types/toast";

type Listener = (toasts: IToast[]) => void;

let toasts: IToast[] = [];
const listeners = new Set<Listener>();

function emit() {
    listeners.forEach(l => l(toasts));
}

export const toastStore = {
    subscribe(listener: Listener): () => void {
        listeners.add(listener);
        listener(toasts);
        return () => listeners.delete(listener);
    },

    add(toast: IToast) {
        toasts = [toast, ...toasts];

        if (toasts.length > MAX_TOASTS) toasts.pop();

        emit();
    },

    remove(id: string) {
        toasts = toasts.filter(t => t.id !== id);
        emit();
    },
};