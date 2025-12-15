using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace BankBackendApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : Controller
    {
        private readonly ITransactionRepository _transactionRepository;

        public TransactionController(ITransactionRepository transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Transaction>))]
        public IActionResult GetTransactions()
        {
            var transactions = _transactionRepository.GetTransactions();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(transactions);
        }
    }
}
