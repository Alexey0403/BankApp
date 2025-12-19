using System;

namespace BankBackendApp.Dto.Auth
{
    public class RegisterDto
    {
        public string name { get; set; }
        public string surname { get; set; }
        public DateOnly birthday { get; set; }
        public string phone_number { get; set; }
        public string gmail { get; set; }

        public string password { get; set; }
    }
}
