namespace BankBackendApp.Models
{
    public class Role
    {
        public int id { get; set; }
        public string name { get; set; }

        public ICollection<User> Users { get; set; }
    }

}
