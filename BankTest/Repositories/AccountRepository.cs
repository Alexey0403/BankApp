using BankBackendApp.Data;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using Microsoft.EntityFrameworkCore;

namespace BankBackendApp.Repositories
{
    public class AccountRepository : IAccountRepository
    {
        private readonly DataContext _context;

        public AccountRepository(DataContext context)
        {
            _context = context;
        }

        public ICollection<Account> GetAccounts()
        {
            return _context.account
                .Include(a => a.Currency)
                .Include(a => a.Cards)
                .OrderBy(a => a.id)
                .ToList();
        }

        public ICollection<Account> GetAccountsByUser(int userId)
        {
            return _context.account
                .Include(a => a.Currency)
                .Include(a => a.Cards)
                .Where(a => a.user_id == userId)
                .OrderBy(a => a.id)
                .ToList();
        }

        public Account GetAccount(int id)
        {
            return _context.account.FirstOrDefault(a => a.id == id);
        }


        public bool CreateAccount(Account account)
        {
            _context.account.Add(account);
            return Save();
        }

        public bool UpdateAccount(Account account)
        {
            _context.account.Update(account);
            return Save();
        }

        public bool DeleteAccount(Account account)
        {
            _context.account.Remove(account);
            return Save();
        }

        public bool Save()
        {
            return _context.SaveChanges() > 0;
        }

    }
}
