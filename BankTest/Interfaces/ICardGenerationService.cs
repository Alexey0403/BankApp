namespace BankBackendApp.Interfaces
{
    public interface ICardGenerationService
    {
        public interface ICardGeneratorService
        {
            string GenerateCardNumber();
            string GenerateCVV();
            (int month, int year) GenerateExpirationDate();
        }
    }

    public interface ICardService
    {
        bool CreateCardForAccount(int accountId, int cardProviderId);
    }
}
