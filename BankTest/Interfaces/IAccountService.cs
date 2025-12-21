namespace BankBackendApp.Interfaces
{
    public interface IAccountService
    {
        string Generate();
        bool AdminUpdateBalance(int accountId, decimal amount, string operation, out string error);
    }
}
