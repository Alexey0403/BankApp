'use client';

import { navItems } from "@/data/menu";
import { logout } from "@/services/auth/auth.service";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./auth/AuthContext";
import { useEffect, useState } from "react";

interface IHeaderProps {
    hideNavMenu?: boolean;
};

export const Header: React.FC<IHeaderProps> = ({ hideNavMenu = false }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();
    const [menuItems, setMenuItems] = useState(navItems);

    const handleLogoClick = () => router.push("/");

    const handleLogOutClick = () => logout();

    const isActive = (href: string) => pathname === href;

    useEffect(() => {
        if (user?.role_id === 1) {
            if (!menuItems.find(m => m.link === '/requests')) {
                setMenuItems(prev => [
                    ...prev,
                    {
                        label: 'Requests',
                        link: '/requests'
                    },
                ]);
            };
        };
    }, [user]);

    return (
        <header>
            <div className="bg-gray-100">
                <div className="container flex justify-between items-center py-6">
                    <Image
                        src="/images/logo.webp"
                        width={200}
                        height={80}
                        alt="Logo"
                        onClick={handleLogoClick}
                        className={`${pathname !== "/" && 'cursor-pointer'}`}
                    />
                    <div className="flex items-center gap-10 text-[18px]/[140%] font-medium">
                        <Link href="/profile">Profile & settings</Link>
                        <button
                            onClick={handleLogOutClick}
                            className="cursor-pointer text-red-600"
                        >Log out</button>
                    </div>
                </div>
            </div>
            { !hideNavMenu && (
                <div className="container text-[18px]/[140%] font-medium py-6 flex items-center gap-10">
                    {menuItems.map(ni => (
                        <Link
                            key={ni.link}
                            href={ni.link}  
                            className={`
                                transition-colors 
                                ${isActive(ni.link) ? 
                                    'bg-gradient-to-br from-[#001f4d] to-[#3fa9f5] bg-clip-text text-transparent cursor-default font-semibold' : 
                                    'hover:bg-gradient-to-br hover:from-[#001f4d] hover:to-[#3fa9f5] hover:bg-clip-text hover:text-transparent'
                                }
                            `}
                        >
                            {ni.label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
};