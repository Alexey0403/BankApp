import { Greetings } from "@/components/Greetings";
import { TransactionList } from "@/components/TransactionList";

export default async function Transactions() {
  return (
    <div className="w-full h-full">
      <Greetings lowerText="Here you will find information about the status of your current transactions." />
      <TransactionList />
    </div>
  );
}
