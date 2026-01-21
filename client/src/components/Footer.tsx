'use client';

import { navItems } from "@/data/menu";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./auth/AuthContext";

interface IFooterProps {
    hideNavMenu?: boolean;
};

export const Footer: React.FC<IFooterProps> = ({ hideNavMenu = false }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [menuItems, setMenuItems] = useState(navItems);
    const { user } = useAuth();

    const isActive = (href: string) => pathname === href;

    const handleLogoClick = () => router.push("/");

    useEffect(() => {
        if (user?.role_id === 1) {
            setMenuItems(prev => [
                ...prev,
                {
                    label: 'Requests',
                    link: '/requests'
                },
            ]);
        };
    }, [user]);

    return (
        <footer className="bg-gray-100">
            { !hideNavMenu && (
                <div className="container py-6 flex gap-8">
                    <Image
                        src="/images/logo.webp"
                        width={100}
                        height={40}
                        alt="Logo"
                        onClick={handleLogoClick}
                        className={`${pathname !== "/" && 'cursor-pointer'}`}
                    />
                    {menuItems.map(ni => (
                        <Link
                            key={ni.link}
                            href={ni.link}  
                            className={`
                                transition-colors text-[18px]/[140%] font-medium
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
            <div className="bg-gradient-to-br from-[#001f4d] to-[#3fa9f5]">
                <div className="container py-6 flex items-center justify-between uppercase text-white">
                    <p>Copyright © 2025 usbank. All rights reserved.</p>
                    <p>1420 Center Avenue, Fresno, California</p>
                </div>
            </div>
        </footer>
    );
};