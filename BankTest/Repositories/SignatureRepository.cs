using BankBackendApp.Data;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;

namespace BankBackendApp.Repositories
{
    public class SignatureRepository : ISignatureRepository
    {
        private readonly DataContext _context;

        public SignatureRepository(DataContext context)
        {
            _context = context;
        }

        public ICollection<Signature> GetSignatures()
        {
            return _context.signature
                .OrderBy(u => u.id)
                .ToList();
        }
    }
}
