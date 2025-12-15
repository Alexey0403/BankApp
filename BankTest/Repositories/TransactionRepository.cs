using BankBackendApp.Data;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;

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
    }
}
