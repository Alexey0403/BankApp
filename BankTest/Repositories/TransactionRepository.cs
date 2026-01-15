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

        public ICollection<Transaction> GetTransactions()
        {
            return _context.transaction
                .OrderBy(u => u.id)
                .ToList();
        }

        public ICollection<Transaction> GetTransactionsByUser(int userId)
        {
            return _context.transaction
                .Include(t => t.AccountFrom)
                .Include(t => t.AccountTo)
                .Include(ts => ts.Status)
                .Where(t =>
                    _context.account.Any(a =>
                        a.user_id == userId &&
                        (a.id == t.account_from_id || a.id == t.account_to_id)
                    )
                )
                .OrderByDescending(t => t.created_at)
                .ToList();
        }
    }
}
