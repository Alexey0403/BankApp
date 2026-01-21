'use client';

import { useState } from "react";
import { useAuth } from "./auth/AuthContext";
import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { backendDateToDayjs } from "@/helpers/date.helper";
import { ProfileForm } from "@/types/profile";
import { apiFetch } from "@/lib/api";
import { toast } from "@/services/toasts/toast";
import { downloadPrivateKey, exportPrivateKey, exportPublicKey, generateKeyPair, pemToBase64, sendPublicKeyToBackend } from "@/services/signature/signature.service";

export const Profile: React.FC = () => {
    const { loading, user, updateUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState<ProfileForm | null>(null);

    const toggleEditing = (e: React.FormEvent) => {
        e.preventDefault();

        if (user) {
            setForm({
                name: user.name,
                surname: user.surname,
                birthday: backendDateToDayjs(user.birthday),
                phone: user.phone_number,
                email: user.gmail
            });
        };

        setEditing(true);
    }

    const handleCancelEditing = () => {
        setEditing(false);
        setForm(null);
    };

    const handleSave = async () => {
        if (editing && form) {
            try {
                const birthday = form.birthday
                    ? form.birthday.format("YYYY-MM-DD")
                    : undefined;

                const payload = { 
                    name: form.name,
                    surname: form.surname,
                    birthday,
                    phone_number: form.phone,
                    gmail: form.email
                };
                
                await apiFetch('/User/myprofile/update', {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                })
                updateUser(payload);
                toast.success("Profile info was successfully updated!");
                setEditing(false);
                setForm(null);
            } catch (err) {
                if (err instanceof Error) {
                    toast.error(err.message)
                };
            };
        };

        return;
    };

    const handleGenerateKeys = async () => {
        try {
            if (user?.publickey === null) {
                const { privateKey, publicKey } = await generateKeyPair();
                const privateKeyPem = await exportPrivateKey(privateKey);
                const publicKeyPem = await exportPublicKey(publicKey);
                const payload = await sendPublicKeyToBackend(publicKeyPem, user);
                downloadPrivateKey(privateKeyPem);
                updateUser(payload);
            } else {
                throw new Error('Key pair was already generated!');
            };
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            };
        };
    };

    if (loading) return null;

    return (
        <div className="py-10 container">
            <h2 className="text-[48px]/[120%] font-medium pb-10">User Profile</h2>
            <div className="max-w-[700px] flex flex-col items-center gap-5">
               <TextField 
                    name="user_name" 
                    label="Name" 
                    variant="outlined"
                    value={editing ? form?.name ?? "" : user?.name ?? ""}
                    onChange={
                        editing
                        ? (e) =>
                            setForm((prev) =>
                                prev ? { ...prev, name: e.target.value } : prev
                            )
                        : undefined
                    }
                    required
                    placeholder="John"
                    className="w-full"
                    disabled={!editing}
                /> 
                <TextField 
                    name="surname" 
                    label="Surname" 
                    variant="outlined" 
                    required
                    placeholder="Doe"
                    disabled={!editing}
                    className="w-full"
                    value={editing ? form?.surname ?? "" : user?.surname ?? ""}
                    onChange={
                        editing
                        ? (e) =>
                            setForm((prev) =>
                                prev ? { ...prev, surname: e.target.value } : prev
                            )
                        : undefined
                    }
                />
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
                                disabled={!editing}
                                value={
                                    editing
                                    ? form?.birthday
                                    : backendDateToDayjs(user?.birthday)
                                }
                                onChange={(value) =>
                                    setForm((prev) => prev && { ...prev, birthday: value })
                                }
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </div>
                <TextField 
                    name="phone" 
                    label="Phone" 
                    placeholder="+48 123 456 789"
                    type="tel"
                    variant="outlined" 
                    required
                    autoComplete="tel"
                    disabled={!editing}
                    value={editing ? form?.phone ?? "" : user?.phone_number ?? ""}
                    onChange={
                        editing
                        ? (e) =>
                            setForm((prev) =>
                                prev ? { ...prev, phone: e.target.value } : prev
                            )
                        : undefined
                    }
                    className="w-full"
                />
                <TextField 
                    name="gmail" 
                    label="Email" 
                    placeholder="john.doe@gmail.com"
                    type="email"
                    variant="outlined" 
                    required
                    autoComplete="email"
                    disabled={!editing}
                    value={editing ? form?.email ?? "" : user?.gmail ?? ""}
                    onChange={
                        editing
                        ? (e) =>
                            setForm((prev) =>
                                prev ? { ...prev, email: e.target.value } : prev
                            )
                        : undefined
                    }
                    className="w-full"
                />
                <div className="flex w-full gap-3">
                    <TextField 
                        label="Public key" 
                        variant="outlined" 
                        required
                        value={user?.publickey ? pemToBase64(user?.publickey) : ''}
                        className="w-full"
                        multiline
                        rows={9}
                    />
                    <div className="w-fit h-fit">
                        <button 
                            onClick={handleGenerateKeys}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer disabled:cursor-not-allowed text-nowrap"
                            disabled={Boolean(user?.publickey)}
                        >Generate key pair</button> 
                    </div>
                </div>
                <div className="flex items-center gap-5 w-full">
                    <button
                        onClick={editing ? handleSave : toggleEditing}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
                    >
                        {editing ? 'Save' : 'Edit'}
                    </button>
                    <button
                        onClick={handleCancelEditing}
                        className="px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-700 cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};