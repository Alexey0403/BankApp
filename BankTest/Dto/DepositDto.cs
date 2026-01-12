namespace BankBackendApp.Dto
{
    public class DepositDto
    {
        public int id { get; set; }
        public decimal amount { get; set; }
        public decimal interest_rate { get; set; }
        public bool is_active { get; set; }

        public DateTime start_date { get; set; }
        public DateTime end_date { get; set; }
        public DateTime created_at { get; set; }
        public int deposit_type_id { get; set; }
        public int currency_id { get; set; }

        public CurrencyDto Currency { get; set; }
        public DepositTypeDto DepositType { get; set; }
    }
}

