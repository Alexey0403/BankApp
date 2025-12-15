using BankBackendApp.Models;

namespace BankBackendApp.Interfaces
{
    public interface ICurrencyRepository
    {
        ICollection<Currency> GetCurrencys();
    }
}
