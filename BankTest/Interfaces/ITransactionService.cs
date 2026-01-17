using BankBackendApp.Dto;
using BankBackendApp.Models;

namespace BankBackendApp.Interfaces
{
    public interface ITransactionService
    {
        Transaction CreateTransaction(int userId, CreateTransactionDto dto, out string error);

        Transaction CancelTransaction(TransactionDto transactionDto, out string error);

        Transaction ConfirmTransaction(TransactionDto transactionDto, out string error);
    }
}
