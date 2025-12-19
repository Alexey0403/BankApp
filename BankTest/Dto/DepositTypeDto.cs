namespace BankBackendApp.Dto
{
    public class DepositTypeDto
    {
        public int id { get; set; }
        public string name { get; set; }
        public string description { get; set; }

        public int min_months { get; set; }
        public int max_months { get; set; }

        public bool can_close_early { get; set; }
        public bool can_add_money { get; set; }

        public decimal interest_rate { get; set; }
    }
}
