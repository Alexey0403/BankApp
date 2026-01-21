import { Greetings } from "@/components/Greetings";
import { Rates } from "@/components/Rates";

export default async function ExchangeRates() {
  const ratesResponse = await fetch('https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5');

  const rates = await ratesResponse.json();

  const date = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
  }).format(new Date());

  return (
    <div className="w-full h-full">
      <Greetings lowerText={`Here you will find the current exchange rates as of ${date}`} />
      <Rates rates={rates} />
    </div>
  );
};