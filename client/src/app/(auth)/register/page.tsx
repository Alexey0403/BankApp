import { RegisterClient } from "@/components/RegisterClient";
import { Suspense } from "react";

export default function RegisterPage() {
    return (
        <Suspense fallback={null}>
            <RegisterClient />
        </Suspense>
    );
};