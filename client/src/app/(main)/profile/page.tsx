import { Greetings } from "@/components/Greetings";
import { Profile } from "@/components/Profile";

export default function ProfilePage() {
  return (
    <div className="w-full h-full">
      <Greetings lowerText="Here you will find all your personal information." />
      <Profile />
    </div>
  );
}
