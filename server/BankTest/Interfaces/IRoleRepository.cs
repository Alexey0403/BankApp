using BankBackendApp.Models;

namespace BankBackendApp.Interfaces
{
    public interface IRoleRepository
    {
        ICollection<Role> GetRoles();
    }
}
