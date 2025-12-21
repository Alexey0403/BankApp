using BankBackendApp.Data;
using BankBackendApp.Interfaces;
using BankBackendApp.Repositories;
using System.Security.Cryptography;
using System.Text;
namespace BankBackendApp.Services
{
    public class AccountService : IAccountService
    {
        public AccountService(DataContext context)
        {
            _context = context;
        }

        private const int Length = 16;
        private readonly DataContext _context;

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

        public bool AdminUpdateBalance(int accountId, decimal amount, string operation, out string error) 
        {
            error = string.Empty;

            var account = _context.account.FirstOrDefault(a => a.id == accountId);
            if (account == null)
            {
                error = "Account not found";
                return false;
            }

            switch (operation.ToUpper())
            {
                case "SET":
                    account.balance = amount;
                    break;

                case "ADD":
                    account.balance += amount;
                    break;

                case "SUB":
                    if (account.balance < amount)
                    {
                        error = "Insufficient balance";
                        return false;
                    }
                    account.balance -= amount;
                    break;

                default:
                    error = "Invalid operation";
                    return false;
            }

            _context.account.Remove(account);
            _context.SaveChanges();

            return true;
        }
    }
}
