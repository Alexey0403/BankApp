using BankBackendApp.Data;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;

namespace BankBackendApp.Repositories
{
    public class DepositRepository : IDepositRepository
    {
        private readonly DataContext _context;

        public DepositRepository(DataContext context)
        {
            _context = context;
        }

        public ICollection<Deposit> GetDeposits()
        {
            return _context.deposit
                .OrderBy(u => u.id)
                .ToList();
        }
    }
}
