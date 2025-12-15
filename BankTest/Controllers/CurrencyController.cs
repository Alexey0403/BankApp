using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace BankBackendApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CurrencyController : Controller
    {
        private readonly ICurrencyRepository _currencyRepository;

        public CurrencyController(ICurrencyRepository currencyRepository)
        {
            _currencyRepository = currencyRepository;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Currency>))]
        public IActionResult GetCurrencys()
        {
            var currencys = _currencyRepository.GetCurrencys();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(currencys);
        }
    }
}
