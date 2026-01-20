using BankBackendApp.Models;

namespace BankBackendApp.Interfaces
{
    public interface ICardRepository
    {
        ICollection<Card> GetCards(bool? status, string? number);
        ICollection<Card> GetCardsByAccount(int accountId);
        bool CreateCard(Card card);
        Card GetCard(int cardId);
        bool UpdateCard(Card card);
        bool DeleteCard(Card card);
        bool Save();
    }
}
