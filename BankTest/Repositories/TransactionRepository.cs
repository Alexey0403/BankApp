using BankBackendApp.Data;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using Microsoft.EntityFrameworkCore;

namespace BankBackendApp.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly DataContext _context;

        public TransactionRepository(DataContext context)
        {
            _context = context;
        }

        public ICollection<Transaction> GetTransactions(int? statusId)
        {
          
            if (!statusId.HasValue) 
            {
                return _context.transaction
                .Include(t => t.AccountFrom)
                    .ThenInclude(af => af.Currency)
                .Include(t => t.AccountTo)
                    .ThenInclude(at => at.Currency)
                .Include(t => t.Status)
                .Include(t => t.Signature)
                .OrderBy(u => u.id)
                .ToList(); ;
            }
            else
            {
                return _context.transaction
                .Include(t => t.AccountFrom)
                    .ThenInclude(af => af.Currency)
                .Include(t => t.AccountTo)
                    .ThenInclude(at => at.Currency)
                .Include(t => t.Status)
                .Include(t => t.Signature)
                .Where(t => t.status_id == statusId.Value)
                .OrderBy(u => u.id)
                .ToList();
            }
            
            

        }

        public ICollection<Transaction> GetTransactionsByUser(int userId)
        {
            return _context.transaction
                .Include(t => t.AccountFrom)
                    .ThenInclude(af => af.Currency)
                .Include(t => t.AccountTo)
                    .ThenInclude(at => at.Currency)
                .Include(t => t.Status)
                .Include(t => t.Signature)
                .Where(t =>
                    _context.account.Any(a =>
                        a.user_id == userId &&
                        (a.id == t.account_from_id || a.id == t.account_to_id)
                    )
                )
                .OrderByDescending(t => t.created_at)
                .ToList();
        }

        public ICollection<Transaction> GetTransactionsByAccount(int accountId)
        {
            return _context.transaction
                .Include(t => t.AccountFrom)
                    .ThenInclude(af => af.Currency)
                .Include(t => t.AccountTo)
                    .ThenInclude(at => at.Currency)
                .Include(t => t.Status)
                .Include(t => t.Signature)
                .Where(t => t.AccountFrom.id == accountId)
                .OrderByDescending(t => t.created_at)
                .ToList();
        }


        public Transaction GetTransactionById(int id) {

            return _context.transaction
                .Include(t => t.AccountFrom)
                    .ThenInclude(af => af.Currency)
                .Include(t => t.AccountTo)
                    .ThenInclude(at => at.Currency)
                .Include(t => t.Status)
                .Include(t => t.Signature)
                .FirstOrDefault(t => t.id == id);

        }
    }
}
