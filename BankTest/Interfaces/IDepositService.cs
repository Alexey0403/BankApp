using BankBackendApp.Dto;

namespace BankBackendApp.Interfaces
{
    public interface IDepositService
    {
        bool CreateDeposit(int user_id, CreateDepositDto dto, out string error);
        bool AddMoneyToDeposit(int user_id, int depositId, AddMoneyToDepositDto dto, out string error);
    }
}
