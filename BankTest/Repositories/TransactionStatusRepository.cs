using BankBackendApp.Data;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;

namespace BankBackendApp.Repositories
{
    public class TransactionStatusRepository : ITransactionStatusRepository
    {
        private readonly DataContext _context;

        public TransactionStatusRepository(DataContext context)
        {
            _context = context;
        }

        public ICollection<TransactionStatus> GetTransactionStatuses()
        {
            return _context.transaction_status
                .OrderBy(u => u.id)
                .ToList();
        }
    }
}
