namespace BankBackendApp.Dto
{
    public class CreateDepositDto
    {
        public int deposit_type_id { get; set; }
        public string number { get; set; }

        public decimal amount { get; set; }
        public int months { get; set; }
    }
}
