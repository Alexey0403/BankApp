namespace BankBackendApp.Models
{
    public class Currency
    {

        public int id { get; set; }
        public string code { get; set; }
        public string name { get; set; }
        public string symbol { get; set; }

        public ICollection<Account> Accounts { get; set; }
        public ICollection<Card> Cards { get; set; }
        public ICollection<Deposit> Deposits { get; set; }
    }

}

