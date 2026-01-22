using BankBackendApp.Dto;
using BankBackendApp.Models;

namespace BankBackendApp.Interfaces
{
    public interface IDepositService
    {
        Deposit CreateDeposit(int user_id, CreateDepositDto dto, out string error);
        Deposit AddMoneyToDeposit(int user_id, int depositId, AddMoneyToDepositDto dto, out string error);
    }
}
