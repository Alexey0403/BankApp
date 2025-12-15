using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using static BankBackendApp.Interfaces.ICardGenerationService;

namespace BankBackendApp.Services
{
    public class CardGeneratorService : ICardGeneratorService
    {
        public string GenerateCardNumber()
        {
            return "4000" + Random.Shared.Next(1000, 9999) + Random.Shared.Next(1000_0000, 9999_9999);
        }

        public string GenerateCVV()
        {
            return Random.Shared.Next(100, 999).ToString();
        }

        public (int month, int year) GenerateExpirationDate()
        {
            var now = DateTime.UtcNow;
            return (now.Month, now.Year + 4);
        }

        public class CardService : ICardService
        {
            private readonly IAccountRepository _accountRepository;
            private readonly ICardRepository _cardRepository;
            private readonly ICardGeneratorService _generator;

            public CardService(
                IAccountRepository accountRepository,
                ICardRepository cardRepository,
                ICardGeneratorService generator)
            {
                _accountRepository = accountRepository;
                _cardRepository = cardRepository;
                _generator = generator;
            }

            public bool CreateCardForAccount(int accountId, int cardProviderId)
            {
                var account = _accountRepository.GetAccount(accountId);
                if (account == null)
                    return false;

                var (month, year) = _generator.GenerateExpirationDate();

                var card = new Card
                {
                    account_id = account.id,
                    currency_id = account.currency_id,
                    number = _generator.GenerateCardNumber(),
                    cvv = _generator.GenerateCVV(),
                    month = month,
                    year = year,
                    card_provider_id = cardProviderId,
                    is_active = true,
                    created_at = DateTime.UtcNow
                };

                return _cardRepository.CreateCard(card);
            }
        }
    }
}
