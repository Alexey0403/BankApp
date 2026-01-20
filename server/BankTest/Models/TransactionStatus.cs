namespace BankBackendApp.Models
{
    public class TransactionStatus
    {
        public int id { get; set; }
        public string status { get; set; }
        public DateTime last_change_date { get; set; }

        public ICollection<Transaction> Transactions { get; set; }
    }

}
