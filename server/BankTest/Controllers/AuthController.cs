using BankBackendApp.Dto;
using BankBackendApp.Dto.Auth;
using BankBackendApp.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BankBackendApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto dto)
        {
            if (!_authService.Register(dto, out var error))
                return BadRequest(error);

            return StatusCode(201);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            var result = _authService.Login(dto, out var error);

            if (result == null)
                return BadRequest(error);

            return Ok(result);
        }
    }
}
