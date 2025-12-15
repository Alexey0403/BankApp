using BankBackendApp.Models;

namespace BankBackendApp.Interfaces
{
    public interface ISignatureRepository
    {
        ICollection<Signature> GetSignatures();
    }
}
