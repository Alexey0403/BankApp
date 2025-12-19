namespace BankBackendApp.Interfaces
{

    public interface ICardService
    {
        string GenerateCardNumber();
        string GenerateCVV();
        (int month, int year) GenerateExpirationDate();
        bool CreateCardForAccount(int accountId, int cardProviderId);
    }
}
