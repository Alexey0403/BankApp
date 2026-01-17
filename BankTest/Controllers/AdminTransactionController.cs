using AutoMapper;
using BankBackendApp.Dto;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using BankBackendApp.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;

namespace BankBackendApp.Controllers
{
    [Route("api/admin/transactions")]
    [ApiController]
    [Authorize(Policy = "Admin")]
    public class AdminTransactionController : Controller
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly ITransactionService _transactionService;
        private readonly IMapper _mapper;

        public AdminTransactionController(ITransactionRepository transactionRepository, ITransactionService transactionService, IMapper mapper)
        {
            _transactionRepository = transactionRepository;
            _transactionService = transactionService;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<TransactionDto>))]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public IActionResult GetTransactions()
        {
            var transactions = _transactionRepository.GetTransactions();

            var result = _mapper.Map<IEnumerable<TransactionDto>>(transactions);
            return Ok(result);
        }

        [Authorize]
        [HttpPut("confirmtransaction")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public IActionResult ConfirmTransaction(int transactionId)
        {

            var transaction = _transactionRepository.GetTransactionById(transactionId);

            _transactionService.ConfirmTransaction(_mapper.Map<TransactionDto>(transaction), out var error);

            if (transaction == null)
                return BadRequest(error);



            var result = _mapper.Map<TransactionDto>(_transactionRepository.GetTransactionById(transaction.id));

            return StatusCode(201, result);
        }

        [Authorize]
        [HttpPut("canceltransaction")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public IActionResult CancelTransaction(int transactionId)
        {

            var transaction = _transactionRepository.GetTransactionById(transactionId);

            _transactionService.CancelTransaction(_mapper.Map<TransactionDto>(transaction), out var error);

            if (transaction == null)
                return BadRequest(error);



            var result = _mapper.Map<TransactionDto>(_transactionRepository.GetTransactionById(transaction.id));

            return StatusCode(201, result);
        }
    }
}
