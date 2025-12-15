namespace BankBackendApp.Models
{
    public class Card
    {
        public int id { get; set; }
        public string number { get; set; }
        public int account_id { get; set; }
        public int currency_id { get; set; }
        public int card_provider_id { get; set; }
        public string cvv { get; set; }
        public int month { get; set; }
        public int year { get; set; }
        public bool is_active { get; set; }
        public DateTime created_at { get; set; }

        public Account Account { get; set; }
        public Currency Currency { get; set; }
        public CardProvider CardProvider { get; set; }
    }

}
