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

        public Transaction CreateTransaction(int userId, CreateTransactionDto dto, out string error)
        {
            error = string.Empty;

            using var dbTransaction = _context.Database.BeginTransaction();

            try
            {

                var fromAccount = _context.account.FirstOrDefault(a => a.number == dto.number_account_from);
                if (fromAccount == null)
                {
                    error = "Sender account not found";
                    return null;
                }

                if (fromAccount.user_id != userId)
                {
                    error = "Access denied";
                    return null;
                }

                var toAccount = _context.account.FirstOrDefault(a => a.number == dto.number_account_to);
                if (toAccount == null)
                {
                    error = "Recipient account not found";
                    return null;
                }

                if (fromAccount.currency_id != toAccount.currency_id)
                {
                    error = "Account currencies do not match";
                    return null;
                }

                if (fromAccount.balance < dto.amount)
                {
                    error = "Insufficient funds";
                    return null;
                }

                if (dto.amount <= 0)
                {
                    error = "Invalid amount";
                    return null;
                }

                fromAccount.balance -= dto.amount;
                _context.account.Update(fromAccount);
                _context.SaveChanges();


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
                return transaction;
            }
            catch (Exception ex)
            {
                dbTransaction.Rollback();
                error = ex.Message;
                return null;
            }
        }
        public Transaction CancelTransaction(TransactionDto transactionDto, out string error)
        {
            error = string.Empty;

            using var dbTransaction = _context.Database.BeginTransaction();

            try
            {
                var fromAccount = _context.account.FirstOrDefault(a => a.id == transactionDto.account_from_id);
                var transaction = _context.transaction.FirstOrDefault(t => t.id == transactionDto.id);

                
                fromAccount.balance += transactionDto.amount;
                _context.account.Update(fromAccount);
                _context.SaveChanges();

                transaction.status_id = 3;
                _context.transaction.Update(transaction);
                _context.SaveChanges();

                dbTransaction.Commit();
                return transaction;

            }
            catch (Exception ex) 
            {
                dbTransaction.Rollback();
                error= ex.Message;
                return null;
            }
        }

        public Transaction ConfirmTransaction(TransactionDto transactionDto, out string error)
        {

            error = string.Empty;

            using var dbTransaction = _context.Database.BeginTransaction();

            try
            {
                var toAccount = _context.account.FirstOrDefault(a => a.id == transactionDto.account_to_id);
                var transaction = _context.transaction.FirstOrDefault(t => t.id == transactionDto.id);


                toAccount.balance += transactionDto.amount;
                _context.account.Update(toAccount);
                _context.SaveChanges();

                transaction.status_id = 2;
                _context.transaction.Update(transaction);
                _context.SaveChanges();

                dbTransaction.Commit();
                return transaction;

            }
            catch (Exception ex)
            {
                dbTransaction.Rollback();
                error = ex.Message;
                return null;
            }
        }
    }
}
