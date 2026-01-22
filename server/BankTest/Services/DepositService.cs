using BankBackendApp.Data;
using BankBackendApp.Dto;
using BankBackendApp.Models;
using BankBackendApp.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BankBackendApp.Services
{
    public class DepositService : IDepositService
    {
        private readonly DataContext _context;

        public DepositService(DataContext context)
        {
            _context = context;
        }

        public Deposit CreateDeposit(int user_id, CreateDepositDto dto, out string error)
        {
            error = string.Empty;

            using var transaction = _context.Database.BeginTransaction();

            try
            {
                var account = _context.account
                    .FirstOrDefault(a => a.number == dto.number && a.user_id == user_id);

                if (account == null || account.user_id != user_id)
                {
                    error = "Account not found or access denied";
                    return null;
                }



                //if (account.currency_id != dto.currency_id)
                //{
                //    error = "Account currency mismatch";
                //    return null;
                //}

                if (account.balance < dto.amount)
                {
                    error = "Insufficient funds";
                    return null;
                }

                if (dto.amount <= 0)
                {
                    error = "Invalid amount";
                    return null;
                }

                var depositType = _context.deposit_type
                    .FirstOrDefault(dt => dt.id == dto.deposit_type_id);

                if (depositType == null)
                {
                    error = "Deposit type not found";
                    return null;
                }

                if (dto.months < depositType.min_months || dto.months > depositType.max_months)
                {
                    error = "Invalid deposit duration";
                    return null;
                }

                var deposit = new Deposit
                {
                    user_id = user_id,
                    deposit_type_id = dto.deposit_type_id,
                    currency_id = account.currency_id,
                    amount = dto.amount,
                    interest_rate = depositType.interest_rate,
                    start_date = DateTime.UtcNow,
                    end_date = DateTime.UtcNow.AddMonths(dto.months),
                    is_active = true,
                    created_at = DateTime.UtcNow
                };

                _context.deposit.Add(deposit);

                account.balance -= dto.amount;
                _context.account.Update(account);

                _context.SaveChanges();
                transaction.Commit();

                return deposit;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                error = ex.Message;
                return null;
            }
        }
        public Deposit AddMoneyToDeposit(int user_id, int depositId, AddMoneyToDepositDto dto, out string error)
        {
            error = string.Empty;


            using var transaction = _context.Database.BeginTransaction();

            try
            {
                var deposit = _context.deposit
                    .Include(d => d.DepositType)
                    .FirstOrDefault(d => d.id == depositId && d.user_id == user_id);

                if (deposit == null || deposit.user_id != user_id)
                {
                    error = "Deposit not found or access denied";
                    return null;
                }

                if (!deposit.is_active)
                {
                    error = "Deposit is not active";
                    return null;
                }

                if (!deposit.DepositType.can_add_money)
                {
                    error = "This deposit type does not allow adding money";
                    return null;
                }

                var account = _context.account
                    .FirstOrDefault(a => a.number == dto.number && a.user_id == user_id);

                if (account == null)
                {
                    error = "Account not found";
                    return null;
                }

                if (account.currency_id != deposit.currency_id)
                {
                    error = "Currency mismatch";
                    return null;
                }

                if (account.balance < dto.amount)
                {
                    error = "Insufficient funds";
                    return null;
                }

                if (dto.amount <= 0)
                {
                    error = "Invalid amount";
                    return null;
                }

                account.balance -= dto.amount;
                deposit.amount += dto.amount;

                _context.account.Update(account);
                _context.deposit.Update(deposit);

                _context.SaveChanges();
                transaction.Commit();

                return deposit;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                error = ex.InnerException?.Message ?? ex.Message;
                return null;
            }
        }

    }
}
