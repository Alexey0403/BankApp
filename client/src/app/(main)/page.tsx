import { Accounts } from "@/components/Accounts";
import { Greetings } from "@/components/Greetings";

export default function Home() {
  return (
    <div className="w-full h-full">
      <Greetings lowerText="We're looking forward to helping you today." />
      <Accounts />
    </div>
  );
};