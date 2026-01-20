using BankBackendApp.Models;

namespace BankBackendApp.Interfaces
{
    public interface IDepositTypeRepository
    {
        ICollection<DepositType> GetDepositTypes();
    }
}
