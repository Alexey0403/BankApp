using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace BankBackendApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepositController : Controller
    {
        private readonly IDepositRepository _depositRepository;

        public DepositController(IDepositRepository depositRepository)
        {
            _depositRepository = depositRepository;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Deposit>))]
        public IActionResult GetDeposits()
        {
            var deposits = _depositRepository.GetDeposits();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(deposits);
        }
    }
}
