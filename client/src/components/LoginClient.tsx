'use client';

import { useAuth } from "@/components/auth/AuthContext";
import { toast } from "@/services/toasts/toast";
import { TextField } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const LoginClient: React.FC = () => {
    const { login, loading, user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get('next') || '/';

    useEffect(() => {
        if (!loading && user) {
            router.replace('/');
        };
    }, [user, loading, router])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const loginValue = form.login.value;
        const password = form.password.value;

        try {
            await login(loginValue, password);
            router.push(next);
        } catch(err) {
            if (err instanceof Error) {
                toast.error(err.message);
            };
        };
    };

    if (loading) return null;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <Image
                src="/images/logo.webp"
                width={400}
                height={160}
                alt="Logo"
                className='mb-10'
            />
            <form 
                onSubmit={handleSubmit}
                className="flex flex-col items-center gap-5 mb-10"
            >
                <TextField 
                    name="login" 
                    label="Login" 
                    variant="outlined" 
                    required
                    placeholder="john.doe@gmail.com"
                    autoComplete="email"
                />
                <TextField 
                    name="password" 
                    type="password"
                    label="Password" 
                    variant="outlined" 
                    required
                    placeholder="*********"
                />
                <button 
                    type="submit"
                    className='w-full text-white bg-gradient-to-br from-[#001f4d] to-[#3fa9f5] p-2 rounded-md translation-colors hover:text-gray-100'
                >Login</button>
            </form>
            <p>Doesn't have an account yet? <Link href="/register" className="bg-gradient-to-br from-[#001f4d] to-[#3fa9f5] bg-clip-text text-transparent cursor-pointer font-semibold">Register now</Link></p>
        </div>
    );
};