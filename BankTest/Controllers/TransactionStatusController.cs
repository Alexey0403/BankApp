using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace BankBackendApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionStatusController : Controller
    {
        private readonly ITransactionStatusRepository _transactionStatusRepository;

        public TransactionStatusController(ITransactionStatusRepository transactionStatusRepository)
        {
            _transactionStatusRepository = transactionStatusRepository;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<TransactionStatus>))]
        public IActionResult GetTransactionStatuses()
        {
            var transaction_statuses = _transactionStatusRepository.GetTransactionStatuses();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(transaction_statuses);
        }
    }
}
