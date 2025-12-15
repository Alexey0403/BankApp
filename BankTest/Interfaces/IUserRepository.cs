using BankBackendApp.Models;

namespace BankBackendApp.Interfaces
{
    public interface IUserRepository
    {
        ICollection<User> GetUsers();
        User GetUser(int id);
        bool UpdateUser(User user);
        bool Save();
    }
}
