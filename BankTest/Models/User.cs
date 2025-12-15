using System.Security.Principal;

namespace BankBackendApp.Models
{
    public class User
    {
        public int id { get; set; }
        public string surname { get; set; }
        public string name { get; set; }
        public string phone_number { get; set; }
        public DateOnly birthday { get; set; }
        public string gmail { get; set; }
        public string hash_password { get; set; }
        public string publickey { get; set; }
        public DateTime created_at { get; set; }

        public int role_id { get; set; }
        public Role Role { get; set; }

        public ICollection<Account> Accounts { get; set; }
        public ICollection<Deposit> Deposits { get; set; }
    }

}
