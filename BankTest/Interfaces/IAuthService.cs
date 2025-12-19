using BankBackendApp.Dto;
using BankBackendApp.Dto.Auth;

namespace BankBackendApp.Interfaces
{
    public interface IAuthService
    {
        bool Register(RegisterDto dto, out string error);
        AuthResponseDto Login(LoginDto dto, out string error);
    }
}
