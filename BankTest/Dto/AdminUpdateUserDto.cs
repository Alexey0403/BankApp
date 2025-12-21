namespace BankBackendApp.Dto
{
    public class AdminUpdateUserDto
    {
        public string name { get; set; }
        public string surname { get; set; }
        public DateOnly birthday { get; set; }
        public int role_id { get; set; }
    }

}
