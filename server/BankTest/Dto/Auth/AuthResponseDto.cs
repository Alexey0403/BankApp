namespace BankBackendApp.Dto
{
    public class AuthResponseDto
    {
        public string token { get; set; }
        public int user_id { get; set; }
        public int role_id { get; set; }
    }
}
