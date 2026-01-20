using BankBackendApp.Models;

namespace BankBackendApp.Interfaces
{
    public interface ITransactionRepository
    {
        ICollection<Transaction> GetTransactions(int? transactionId);

        ICollection<Transaction> GetTransactionsByUser(int userId);
        ICollection<Transaction> GetTransactionsByAccount(int accountId);
        Transaction GetTransactionById(int transactionId);
    }
}
