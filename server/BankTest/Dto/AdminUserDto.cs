namespace BankBackendApp.Dto
{
    public class AdminUserDto
    {
        public int id { get; set; }
        public string name { get; set; }
        public string surname { get; set; }
        public string gmail { get; set; }
        public DateOnly birthday { get; set; }
        public int role_id { get; set; }
        public DateTime created_at { get; set; }
    }
}
