using BankBackendApp.Dto;

namespace BankBackendApp.Interfaces
{
    public interface IDepositService
    {
        bool CreateDeposit(CreateDepositDto dto, out string error);
        bool AddMoneyToDeposit(int depositId, AddMoneyToDepositDto dto, out string error);
    }
}
