using AutoMapper;
using BankBackendApp.Dto;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using BankBackendApp.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BankBackendApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : Controller
    {
        private readonly ICardRepository _cardRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly IMapper _mapper;
        private readonly IAccountService _accountService;
        private readonly ITransactionRepository _transactionRepository;

        public AccountController(IAccountRepository accountRepository, ITransactionRepository transactionRepository, ICardRepository cardRepository, IMapper mapper, IAccountService accountService)
        {
            _cardRepository = cardRepository;
            _accountRepository = accountRepository;
            _mapper = mapper;
            _accountService = accountService;
            _transactionRepository = transactionRepository;
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

        [Authorize]
        [HttpPost]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public IActionResult CreateAccount([FromBody] CreateAccountDto createAccountDto)
        {
            if (createAccountDto == null)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);

            var account = _mapper.Map<Account>(createAccountDto);

            account.user_id = userId;

            account.number = _accountService.Generate();

            if (!_accountRepository.CreateAccount(account))
            {
                ModelState.AddModelError("", "Something went wrong while creating account");
                return StatusCode(500, ModelState);
            }

            var result = _mapper.Map<AccountDto>(_accountRepository.GetAccount(account.id));


            return StatusCode(201, result);

        }

        [Authorize]
        [HttpPut("{accountId}/close")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public IActionResult CloseAccount(int accountId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var account = _accountRepository.GetAccount(accountId);
            var transactions = _transactionRepository.GetTransactionsByAccount(accountId);

            if (account == null)
                return NotFound();

            if (account.user_id != userId)
                return Forbid();

            if (!account.is_active)
                return NoContent();

            foreach (var transaction in transactions)
                if (transaction.status_id == 1) return StatusCode(400, "There is active transactions that can not close this account");

            account.is_active = false;


            foreach(var card in account.Cards)
            {
                card.is_active = false;
            }
                

            if (!_accountRepository.UpdateAccount(account))
                return StatusCode(500, "Error while closing account");

            return NoContent();
        }

        [Authorize]
        [HttpPut("{accountId}/reopen")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public IActionResult ReopenAccount(int accountId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);  

            var account = _accountRepository.GetAccount(accountId);

            if (account == null)
                return NotFound();

            if (account.user_id != userId)
                return Forbid();

            if (account.is_active)
                return NoContent();

            account.is_active = true;

            if (!_accountRepository.UpdateAccount(account))
                return StatusCode(500, "Error while reopening account");

            return NoContent();
        }
    }
}
