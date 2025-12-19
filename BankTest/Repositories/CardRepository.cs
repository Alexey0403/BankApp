using BankBackendApp.Data;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;

namespace BankBackendApp.Repositories
{
    public class CardRepository : ICardRepository
    {
        private readonly DataContext _context;

        public CardRepository(DataContext context)
        {
            _context = context;
        }

        public ICollection<Card> GetCards()
        {
            return _context.card
                .OrderBy(u => u.id)
                .ToList();
        }

        public ICollection<Card> GetCardsByAccount(int accountId)
        {
            return _context.card
                .Where(c => c.account_id == accountId)
                .OrderBy(c => c.id)
                .ToList();
        }

        public bool CreateCard(Card card)
        {
            _context.card.Add(card);
            return Save();
        }

        public Card GetCard(int cardId)
        {
            return _context.card.FirstOrDefault(c => c.id == cardId);
        }

        public bool UpdateCard(Card card)
        {
            _context.card.Update(card);
            return Save();
        }

        public bool Save()
        {
            return _context.SaveChanges() > 0;
        }
    }
}
