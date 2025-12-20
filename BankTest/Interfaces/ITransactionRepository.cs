using BankBackendApp.Models;

namespace BankBackendApp.Interfaces
{
    public interface ITransactionRepository
    {
        ICollection<Transaction> GetTransactions();

        ICollection<Transaction> GetTransactionsByUser(int userId);
    }
}
