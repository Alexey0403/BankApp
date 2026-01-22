import { IDeposit } from "@/types/deposit";
import { Deposit } from "./Deposit";

interface IDepositsProps {
    deposits: IDeposit[];
    onTopUp: (id: number, amount: number) => void;
};

export const Deposits: React.FC<IDepositsProps> = ({ deposits, onTopUp }) => {

    if (!deposits.length) return null;

    return (
        <section className="container py-10">
            <h2 className="text-[48px]/[120%] font-medium mb-4">Active Deposits</h2>
            <div className="flex flex-col gap-6">
                {deposits.map(d => (
                    <Deposit
                        deposit={d}
                        onTopUp={onTopUp}
                    />
                ))}
            </div>
        </section>  
    );
};