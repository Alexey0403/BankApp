namespace BankBackendApp.Dto
{
    public class SignatureDto
    {
        public int id { get; set; }
        public byte[] signature { get; set; }
        public DateTime created_at { get; set; }
    }
}
