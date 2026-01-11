namespace BankBackendApp.Dto
{
    public class AdminAccountDto
    {
        public int id { get; set; }
        public string number { get; set; }
        public decimal balance { get; set; }
        public int currency_id { get; set; }
        public int user_id { get; set; }
        public bool is_active { get; set; }
        public DateTime created_at { get; set; }
        public CurrencyDto Currency { get; set; }
        public List<OutCardDto> Cards { get; set; }
    }
}
