import { CurrencyImages } from "@/data/currency";
import { IRate } from "@/types/rate";
import Image from "next/image";

interface IRateTableProps {
    rate: IRate;
    option: "buy" | "sale";
};

export const RateTable: React.FC<IRateTableProps> = ({ rate, option }) => {
    const { ccy, base_ccy } = rate;

    return (
        <div className="bg-gray-100 rounded-md p-6 w-full">
            <div className="flex justify-between items-center">
                <div className="rounded-full bg-gradient-to-br from-[#001f4d] to-[#3fa9f5] backdrop-blur-md p-3 w-fit">
                    <Image
                        src={CurrencyImages[ccy as keyof typeof CurrencyImages]}
                        width={32}
                        height={32}
                        alt={ccy}
                        className="object-contain w-8 h-8"
                    /> 
                </div>
                <div>
                    1 {ccy} = {Number(rate[option])} {base_ccy}
                </div>
                <div className="rounded-full bg-gradient-to-br from-[#001f4d] to-[#3fa9f5] backdrop-blur-md p-3 w-fit">
                    <Image
                        src={CurrencyImages[base_ccy as keyof typeof CurrencyImages]}
                        width={32}
                        height={32}
                        alt={base_ccy}
                        className="object-contain w-8 h-8"
                    />  
                </div>
            </div>
        </div>
    );
};