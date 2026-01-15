namespace BankBackendApp.Dto
{
    public class TransactionDto
    {
        public int id { get; set; }
        public int account_from_id { get; set; }
        public int account_to_id { get; set; }
        public decimal amount { get; set; }
        public string purpose_text { get; set; }
        public string recipients_name { get; set; }
        public string recipients_surname { get; set; }
        public int status_id { get; set; }
        public DateTime created_at { get; set; }

        public AccountDto AccountFrom { get; set; }
        public AccountDto AccountTo { get; set;}

        public TransactionStatusDto Status { get; set; }
    }
}
