namespace BankBackendApp.Models
{
    public class Deposit
    {
        public int id { get; set; }
        public int user_id { get; set; }
        public int deposit_type_id { get; set; }
        public int currency_id { get; set; }
        public decimal amount { get; set; }
        public decimal interest_rate { get; set; }
        public DateTime start_date { get; set; }
        public DateTime end_date { get; set; }
        public bool is_active { get; set; }
        public DateTime created_at { get; set; }

        public User User { get; set; }
        public DepositType DepositType { get; set; }
        public Currency Currency { get; set; }
    }

}
