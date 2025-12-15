using AutoMapper;
using BankBackendApp.Dto;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace BankBackendApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : Controller
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IMapper _mapper;

        public AccountController(IAccountRepository accountRepository, IMapper mapper)
        {
            _accountRepository = accountRepository;
            _mapper = mapper;
        }

        [HttpGet("user/{userId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<AccountDto>))]
        [ProducesResponseType(404)]
        public IActionResult GetUserAccounts(int userId)
        {
            var accounts = _accountRepository.GetAccountsByUser(userId);

            if (accounts == null || !accounts.Any())
                return NotFound();

            var result = _mapper.Map<IEnumerable<AccountDto>>(accounts);

            return Ok(result);
        }

        // POST api/Account
        [HttpPost]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        public IActionResult CreateAccount([FromBody] CreateAccountDto createAccountDto)
        {
            if (createAccountDto == null)
                return BadRequest(ModelState);

            var account = _mapper.Map<Account>(createAccountDto);

            account.number = $"{DateTime.UtcNow.Ticks}";

            if (!_accountRepository.CreateAccount(account))
            {
                ModelState.AddModelError("", "Something went wrong while creating account");
                return StatusCode(500, ModelState);
            }

            return StatusCode(201);
        }
    }
}
