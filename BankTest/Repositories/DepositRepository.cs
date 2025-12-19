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

        public ICollection<Deposit> GetDepositsByUser(int userId)
        {
            return _context.deposit
                .Where(d => d.user_id == userId)
                .OrderByDescending(d => d.created_at)
                .ToList();
        }
    }
}
