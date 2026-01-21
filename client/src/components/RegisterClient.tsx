'use client';

import { useAuth } from "@/components/auth/AuthContext";
import { register } from "@/services/auth/auth.service";
import { toast } from "@/services/toasts/toast";
import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const RegisterClient: React.FC = () => {
    const { loading, user } = useAuth();
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

        const password = form.password.value;
        const password_confirm = form.password_confirm.value;

        if (password !== password_confirm) {
            toast.error("Passwords don't match!");
            return;
        };

        const name = form.user_name.value;
        const surname = form.surname.value;

        const birthdayRaw = form.birthday.value;
        const [month, day, year] = birthdayRaw.split('/');
        const birthday = `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;

        const phone_number = form.phone.value;
        const gmail = form.gmail.value;

        try {
            await register({
                name,
                surname,
                birthday,
                phone_number,
                gmail,
                password
            });
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
                <div className="flex items-center gap-5">
                    <TextField 
                        name="user_name" 
                        label="Name" 
                        variant="outlined" 
                        required
                        placeholder="John"
                    />
                    <TextField 
                        name="surname" 
                        label="Surname" 
                        variant="outlined" 
                        required
                        placeholder="Doe"
                    />
                </div>
                <div className="w-full">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                name="birthday"
                                label="Birthday"
                                className="w-full"
                                slotProps={{
                                    textField: {
                                        required: true,
                                    }   
                                }}
                                maxDate={dayjs().subtract(0, 'day')}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </div>
                <div className="flex items-center gap-5">
                    <TextField 
                        name="phone" 
                        label="Phone" 
                        placeholder="+48 123 456 789"
                        type="tel"
                        variant="outlined" 
                        required
                        autoComplete="tel"
                    />
                    <TextField 
                        name="gmail" 
                        label="Email" 
                        placeholder="john.doe@gmail.com"
                        type="email"
                        variant="outlined" 
                        required
                        autoComplete="email"
                    />
                </div>
                <div className="flex items-center gap-5">
                    <TextField 
                        name="password" 
                        label="Password" 
                        placeholder="*********"
                        type="password"
                        variant="outlined" 
                        required
                    />
                    <TextField 
                        name="password_confirm" 
                        label="Confirm Password" 
                        placeholder="*********"
                        type="password"
                        variant="outlined" 
                        required
                    />
                </div>
                <button 
                    type="submit"
                    className='w-full text-white bg-gradient-to-br from-[#001f4d] to-[#3fa9f5] p-2 rounded-md translation-colors hover:text-gray-100'
                >Register</button>
            </form>
            <p>Already have an account? <Link href="/login" className="bg-gradient-to-br from-[#001f4d] to-[#3fa9f5] bg-clip-text text-transparent cursor-pointer font-semibold">Login now</Link></p>
        </div>
    );
};