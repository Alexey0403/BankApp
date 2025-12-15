namespace BankBackendApp.Models
{
    public class DepositType
    {
        public int id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public int min_months { get; set; }
        public int max_months { get; set; }
        public bool can_close_early { get; set; }
        public decimal interest_rate { get; set; }
        public bool can_add_money { get; set; }
        public DateTime created_at { get; set; }

        public ICollection<Deposit> Deposits { get; set; }
    }

}
