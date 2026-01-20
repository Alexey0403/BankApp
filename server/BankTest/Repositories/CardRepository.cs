using BankBackendApp.Data;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using Microsoft.EntityFrameworkCore;

namespace BankBackendApp.Repositories
{
    public class CardRepository : ICardRepository
    {
        private readonly DataContext _context;

        public CardRepository(DataContext context)
        {
            _context = context;
        }

        public ICollection<Card> GetCards(bool? status, string? number)
        {
            if (!status.HasValue && number == null)
            {
                return _context.card
                .Include(c => c.Currency)
                .Include(c => c.CardProvider)
                .OrderBy(u => u.id)
                .ToList();
            }
            else if (status.HasValue && number == null) 
            {
                return _context.card
                .Include(c => c.Currency)
                .Include(c => c.CardProvider)
                .Where(c => c.is_active == status.Value)
                .OrderBy(u => u.id)
                .ToList();
            } else if (!status.HasValue && number != null) 
            {
                return _context.card
                .Include(c => c.Currency)
                .Include(c => c.CardProvider)
                .Where(a => a.Account.number == number)
                .OrderBy(u => u.id)
                .ToList();
            } else
            {
                return _context.card
                .Include(c => c.Currency)
                .Include(c => c.CardProvider)
                .Where(a => a.Account.number == number)
                .Where(a => a.is_active == status.Value)
                .OrderBy(u => u.id)
                .ToList();
            }
        }

        public ICollection<Card> GetCardsByAccount(int accountId)
        {
            return _context.card
                .Include(c => c.Currency)
                .Include(c => c.CardProvider)
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
            return _context.card
                .Include(c => c.Currency)
                .Include(c => c.CardProvider)
                .FirstOrDefault(c => c.id == cardId);
        }

        public bool UpdateCard(Card card)
        {
            _context.card.Update(card);
            return Save();
        }

        public bool DeleteCard(Card card)
        {
            _context.card.Remove(card);
            return Save();
        }

        public bool Save()
        {
            return _context.SaveChanges() > 0;
        }
    }
}
