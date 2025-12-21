using AutoMapper;
using BankBackendApp.Dto;
using BankBackendApp.Interfaces;
using BankBackendApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BankBackendApp.Controllers
{
    [Route("api/admin/accounts")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminAccountController : Controller
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IMapper _mapper;
        private readonly IAccountService _accountService;

        public AdminAccountController(
            IAccountRepository accountRepository,
            IMapper mapper,
            IAccountService accountService)
        {
            _accountRepository = accountRepository;
            _mapper = mapper;
            _accountService = accountService;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<AdminAccountDto>))]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public IActionResult GetAccounts()
        {
            var accounts = _accountRepository.GetAccounts();

            var result = _mapper.Map<IEnumerable<AdminAccountDto>>(accounts);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{accountId}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public IActionResult DeleteAccount(int accountId)
        {
            var account = _accountRepository.GetAccount(accountId);
            if (account == null)
                return NotFound();

            if (account.is_active)
                return BadRequest("Account must be inactive before deletion");

            if (!_accountRepository.DeleteAccount(account))
                return StatusCode(500, "Error while deleting account");

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{accountId}/balance")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public IActionResult UpdateAccountBalance(int accountId, [FromBody] AdminUpdateAccauntDto dto)
        {
            if (dto == null)
                return BadRequest();

            if (!_accountService.AdminUpdateBalance(
                accountId,
                dto.amount,
                dto.operation,
                out var error))
            {
                return BadRequest(error);
            }

            return NoContent();
        }


    }
}
