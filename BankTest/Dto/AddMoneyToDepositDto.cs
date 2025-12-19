namespace BankBackendApp.Dto
{
    public class AddMoneyToDepositDto
    {
        public int user_id { get; set; }
        public int account_id { get; set; }
        public decimal amount { get; set; }
    }
}
