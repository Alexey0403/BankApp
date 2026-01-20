using BankBackendApp.Data;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;

namespace BankBackendApp.Repositories
{
    public class CurrencyRepository : ICurrencyRepository
    {
        private readonly DataContext _context;

        public CurrencyRepository(DataContext context)
        {
            _context = context;
        }

        public ICollection<Currency> GetCurrencys()
        {
            return _context.currency
                .OrderBy(u => u.id)
                .ToList();
        }
    }
}
