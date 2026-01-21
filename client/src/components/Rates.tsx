import { IRate } from "@/types/rate";
import { RateTable } from "./RateTable";

interface IRatesProps {
    rates: IRate[];
};

export const Rates: React.FC<IRatesProps> = ({ rates }) => {
    return (
        <section className="container py-10">
            <h2 className="text-[48px]/[120%] font-medium pb-10">Exchange Rates</h2>
            <div className="flex flex-col gap-6">
                {rates.map((rate, index) => (
                    <div 
                        key={index}
                        className="flex items-center justify-between gap-10"
                    >
                        <div className="flex flex-col gap-2 w-full">
                            {index === 0 && <h3 className="text-[32px]/[120%] font-medium">Buy</h3>}
                            <RateTable rate={rate} option="buy" />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            {index === 0 && <h3 className="text-[32px]/[120%] font-medium">Sale</h3>}
                            <RateTable rate={rate} option="sale" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};