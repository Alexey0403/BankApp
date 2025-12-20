using BankBackendApp.Interfaces;
using System.Security.Cryptography;
using System.Text;
namespace BankBackendApp.Services
{
    public class AccountService : IAccountService
    {
        private const int Length = 16;

        public string Generate()
        {
            var bytes = RandomNumberGenerator.GetBytes(Length);
            var sb = new StringBuilder(Length);

            foreach (var b in bytes)
            {
                sb.Append(b % 10);
            }

            return sb.ToString();
        }
    }
}
