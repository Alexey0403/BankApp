namespace BankBackendApp.Dto
{
    public class AccountDto
    {
        public int id { get; set; }
        public string number { get; set; }
        public decimal balance { get; set; }
        public bool is_active { get; set; }
        public int currency_id { get; set; }
        public DateTime created_at { get; set; }
    }
}
