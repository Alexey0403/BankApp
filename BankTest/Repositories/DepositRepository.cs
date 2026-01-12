using BankBackendApp.Data;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using Microsoft.EntityFrameworkCore;

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
                .Include(d => d.Currency)
                .Include(d => d.DepositType)
                .Where(d => d.user_id == userId)
                .OrderByDescending(d => d.created_at)
                .ToList();
        }

        public Deposit GetDeposiById(int id)
        {
            return _context.deposit
                .Include(d => d.Currency)
                .Include(d => d.DepositType)
                .FirstOrDefault(d => d.id == id);
        }
    }
}
