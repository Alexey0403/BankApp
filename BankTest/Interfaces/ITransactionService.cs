using BankBackendApp.Dto;

namespace BankBackendApp.Interfaces
{
    public interface ITransactionService
    {
        bool CreateTransaction(int userId, CreateTransactionDto dto, out string error);
    }
}
