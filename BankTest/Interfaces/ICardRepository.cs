using BankBackendApp.Models;

namespace BankBackendApp.Interfaces
{
    public interface ICardRepository
    {
        ICollection<Card> GetCards();
        ICollection<Card> GetCardsByAccount(int accountId);
        bool CreateCard(Card card);
        bool Save();
    }
}
