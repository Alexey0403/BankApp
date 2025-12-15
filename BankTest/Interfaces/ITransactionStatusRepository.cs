using BankBackendApp.Models;

namespace BankBackendApp.Interfaces
{
    public interface ITransactionStatusRepository
    {
        ICollection<TransactionStatus> GetTransactionStatuses();
    }
}
