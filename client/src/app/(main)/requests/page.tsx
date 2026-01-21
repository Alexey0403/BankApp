import { AdminAccounts } from "@/components/AdminAccounts";
import { AdminTransactions } from "@/components/AdminTransactions";
import { Greetings } from "@/components/Greetings";

export default function Requests() {
  return (
    <div className="w-full h-full">
      <Greetings lowerText="Here you will find admin information about user requests." />
      <AdminAccounts />
      <AdminTransactions />
    </div>
  );
}
