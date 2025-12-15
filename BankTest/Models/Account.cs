namespace BankBackendApp.Models
{
    public class Account
    {
        public int id { get; set; }
        public string number { get; set; }
        public int user_id { get; set; }
        public decimal balance { get; set; }
        public int currency_id { get; set; }
        public bool is_active { get; set; }
        public DateTime created_at { get; set; }

        public User User { get; set; }
        public Currency Currency { get; set; }

        public ICollection<Card> Cards { get; set; }
        public ICollection<Transaction> TransactionsFrom { get; set; }
        public ICollection<Transaction> TransactionsTo { get; set; }
        public ICollection<Deposit> Deposits { get; set; }
    }

}
