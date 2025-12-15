using BankBackendApp.Data;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;

namespace BankBackendApp.Repositories
{
    public class DepositTypeRepository : IDepositTypeRepository
    {
        private readonly DataContext _context;

        public DepositTypeRepository(DataContext context)
        {
            _context = context;
        }

        public ICollection<DepositType> GetDepositTypes()
        {
            return _context.deposit_type
                .OrderBy(u => u.id)
                .ToList();
        }
    }
}
