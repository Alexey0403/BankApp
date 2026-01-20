namespace BankBackendApp.Models
{
    public class Signature
    {
        public int id { get; set; }
        public byte[] signature { get; set; }
        public DateTime created_at { get; set; }

        public ICollection<Transaction> Transactions { get; set; }
    }

}
