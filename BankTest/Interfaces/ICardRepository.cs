using BankBackendApp.Models;

namespace BankBackendApp.Interfaces
{
    public interface ICardRepository
    {
        ICollection<Card> GetCardsByAccount(int accountId);
        bool CreateCard(Card card);
        Card GetCard(int cardId);
        bool UpdateCard(Card card);
        bool Save();
    }
}
