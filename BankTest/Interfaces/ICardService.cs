using BankBackendApp.Models;

namespace BankBackendApp.Interfaces
{

    public interface ICardService
    {
        string GenerateCardNumber();
        string GenerateCVV();
        (int month, int year) GenerateExpirationDate();
        Card CreateCardForAccount(int accountId, int cardProviderId);
    }
}
