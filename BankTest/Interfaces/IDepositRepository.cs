using BankBackendApp.Models;

namespace BankBackendApp.Interfaces
{
    public interface IDepositRepository
    {
        ICollection<Deposit> GetDepositsByUser(int userId);
    }
}
