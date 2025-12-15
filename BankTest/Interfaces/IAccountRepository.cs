using BankBackendApp.Models;

namespace BankBackendApp.Interfaces
{
    public interface IAccountRepository
    {
        ICollection<Account> GetAccountsByUser(int userId);

        Account GetAccount(int id);
        bool CreateAccount(Account account);
        bool Save();
    }
}
