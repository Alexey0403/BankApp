using AutoMapper;
using BankBackendApp.Dto;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using BankBackendApp.Repositories;
using BankBackendApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BankBackendApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : Controller
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly IMapper _mapper;
        private readonly ITransactionService _transactionService;

        public TransactionController(ITransactionRepository transactionRepository, IMapper mapper, ITransactionService transactionService)
        {
            _transactionRepository = transactionRepository;
            _mapper = mapper;
            _transactionService = transactionService;
        }


        [Authorize]
        [HttpGet("mytransactions")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<TransactionDto>))]
        [ProducesResponseType(401)]
        public IActionResult GetMyTransactions()
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var transactions = _transactionRepository.GetTransactionsByUser(userId);

            var result = _mapper.Map<IEnumerable<TransactionDto>>(transactions);
            return Ok(result);
        }

        [Authorize]
        [HttpPost]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public IActionResult CreateTransaction([FromBody] CreateTransactionDto dto)
        {
            var userId = int.Parse(
                User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value
            );

            var transaction = _transactionService.CreateTransaction(userId, dto, out var error);

            if (transaction == null)
                return BadRequest(error);

            var result = _mapper.Map<TransactionDto>(transaction);

            return StatusCode(201, result);
        }


    }
}
