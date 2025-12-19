using BankBackendApp.Models;

namespace BankBackendApp.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
