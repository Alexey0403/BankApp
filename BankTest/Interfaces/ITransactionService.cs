using BankBackendApp.Dto;
using BankBackendApp.Models;

namespace BankBackendApp.Interfaces
{
    public interface ITransactionService
    {
        Transaction CreateTransaction(int userId, CreateTransactionDto dto, out string error);
    }
}
