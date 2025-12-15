using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace BankBackendApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepositTypeController : Controller
    {
        private readonly IDepositTypeRepository _depositTypeRepository;

        public DepositTypeController(IDepositTypeRepository depositTypeRepository)
        {
            _depositTypeRepository = depositTypeRepository;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<DepositType>))]
        public IActionResult GetDepositTypes()
        {
            var deposit_types = _depositTypeRepository.GetDepositTypes();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(deposit_types);
        }
    }
}
