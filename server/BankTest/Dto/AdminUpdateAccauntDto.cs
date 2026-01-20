namespace BankBackendApp.Dto
{
    public class AdminUpdateAccauntDto
    {
        public decimal amount { get; set; }
        public string operation { get; set; }
        // "SET", "ADD", "SUB"
    }
}
