import { DepositPageContainer } from "@/components/DepositPagecContainer";
import { Greetings } from "@/components/Greetings";

export default function Savings() {
  return (
    <div className="w-full h-full">
      <Greetings lowerText="Here you will find general information about the bank's deposits and your open savings." />
      <DepositPageContainer />
    </div>
  );
}
