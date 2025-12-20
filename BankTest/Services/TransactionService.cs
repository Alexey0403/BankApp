using BankBackendApp.Data;
using BankBackendApp.Dto;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using BankBackendApp.Repositories;

namespace BankBackendApp.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly DataContext _context;

        public TransactionService(DataContext context)
        {
            _context = context;
        }

        public bool CreateTransaction(int userId, CreateTransactionDto dto, out string error)
        {
            error = string.Empty;

            using var dbTransaction = _context.Database.BeginTransaction();

            try
            {

                var fromAccount = _context.account.FirstOrDefault(a => a.id == dto.account_from_id);
                if (fromAccount == null)
                {
                    error = "Sender account not found";
                    return false;
                }

                if (fromAccount.user_id != userId)
                {
                    error = "Access denied";
                    return false;
                }

                var toAccount = _context.account.FirstOrDefault(a => a.id == dto.account_to_id);
                if (toAccount == null)
                {
                    error = "Recipient account not found";
                    return false;
                }

                if (fromAccount.currency_id != toAccount.currency_id)
                {
                    error = "Account currencies do not match";
                    return false;
                }

                if (fromAccount.balance < dto.amount)
                {
                    error = "Insufficient funds";
                    return false;
                }

                var signature = new Signature
                {
                    signature = Convert.FromBase64String(dto.signature),
                    created_at = dto.created_at
                };
                _context.signature.Add(signature);
                _context.SaveChanges();

                var transaction = new Transaction
                {
                    account_from_id = fromAccount.id,
                    account_to_id = toAccount.id,
                    amount = dto.amount,
                    purpose_text = dto.purpose_text,
                    recipients_name = dto.recipients_name,
                    recipients_surname = dto.recipients_surname,
                    status_id = 1,
                    created_at = dto.created_at,
                    signature_id = signature.id
                };

            



                _context.transaction.Add(transaction);
                _context.SaveChanges();
                dbTransaction.Commit();
                return true;
            }
            catch (Exception ex)
            {
                dbTransaction.Rollback();
                error = ex.Message;
                return false;
            }
        }

    }
}
