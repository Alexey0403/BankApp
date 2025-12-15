using BankBackendApp.Data;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;

namespace BankBackendApp.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public ICollection<User> GetUsers()
        {
            return _context.user
                .OrderBy(u => u.id)
                .ToList();
        }

        public User GetUser(int id)
        {
            return _context.user
                .FirstOrDefault(u => u.id == id);
        }

        public bool UpdateUser(User user)
        {
            _context.user.Update(user);
            return Save();
        }

        public bool Save()
        {
            return _context.SaveChanges() > 0;
        }

    }
}
