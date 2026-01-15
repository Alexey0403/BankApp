namespace BankBackendApp.Dto
{
    public class TransactionStatusDto
    {
        public int id { get; set; }
        public string status { get; set; }
        public DateTime last_change_date { get; set; }
    }
}
