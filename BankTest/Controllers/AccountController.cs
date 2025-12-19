using AutoMapper;
using BankBackendApp.Dto;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
        [Authorize]
        [HttpGet("user/myaccounts")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<AccountDto>))]
        [ProducesResponseType(404)]
        public IActionResult GetUserAccounts()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);

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

        [HttpPut("{accountId}/close")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult CloseAccount(int accountId)
        {
            var account = _accountRepository.GetAccount(accountId);

            if (account == null)
                return NotFound();

            if (!account.is_active)
                return NoContent();

            account.is_active = false;

            if (!_accountRepository.UpdateAccount(account))
                return StatusCode(500, "Error while closing account");

            return NoContent();
        }

        [HttpPut("{accountId}/reopen")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult ReopenAccount(int accountId)
        {
            var account = _accountRepository.GetAccount(accountId);

            if (account == null)
                return NotFound();

            if (account.is_active)
                return NoContent();

            account.is_active = true;

            if (!_accountRepository.UpdateAccount(account))
                return StatusCode(500, "Error while reopening account");

            return NoContent();
        }
    }
}
