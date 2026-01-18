using BankBackendApp.Models;

namespace BankBackendApp.Interfaces
{
    public interface IAccountRepository
    {
        ICollection<Account> GetAccounts(bool? status);
        ICollection<Account> GetAccountsByUser(int userId);

        Account GetAccount(int id);
        bool CreateAccount(Account account);
        bool UpdateAccount(Account account);
        bool DeleteAccount(Account account);
        bool Save();
    }
}
