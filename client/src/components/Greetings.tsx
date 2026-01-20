'use client';

import { useAuth } from "./auth/AuthContext";

interface IGreetingsProps {
    lowerText: string;
};

export const Greetings: React.FC<IGreetingsProps> = ({ lowerText }) => {
    const hours = new Date().getHours();
    const { loading, user } = useAuth();

    let greeting = '';

    if (hours >= 5 && hours < 12) {
        greeting = 'Good morning';
    } else if (hours >= 12 && hours < 17) {
        greeting = 'Good afternoon';
    } else if (hours >= 17 && hours < 22) {
        greeting = 'Good evening';
    } else {
        greeting = 'Good night';
    };

    if (loading) return null;
    
    return (
        <section className="bg-gradient-to-br from-[#001f4d] to-[#3fa9f5] text-white py-16">
            <div className="container">
                <h2 className="text-[48px]/[120%] font-medium mb-8">{greeting}{user?.name && `, ${user?.name}`}.</h2>
                <p className="text-[24px]/[120%]">{lowerText}</p>
            </div>
        </section>
    );
};