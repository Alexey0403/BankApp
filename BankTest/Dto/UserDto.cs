namespace BankBackendApp.Dto
{
    public class UserDto
    {
        public int id { get; set; }
        public string name { get; set; }
        public string surname { get; set; }
        public string phone_number { get; set; }
        public string gmail { get; set; }
        public string publickey { get; set; }
        public DateOnly birthday { get; set; }
    }
}
