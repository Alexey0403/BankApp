using AutoMapper;
using BankBackendApp.Dto;
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
        private readonly IMapper _mapper;
        private readonly IDepositService _depositService;

        public DepositController(IDepositRepository depositRepository, IMapper mapper, IDepositService depositService)
        {
            _depositRepository = depositRepository;
            _mapper = mapper;
            _depositService = depositService;
        }

        // GET api/Deposit/user/5
        [HttpGet("user/{userId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<DepositDto>))]
        [ProducesResponseType(404)]
        public IActionResult GetDepositsByUser(int userId)
        {
            var deposits = _depositRepository.GetDepositsByUser(userId);

            if (deposits == null || !deposits.Any())
                return NotFound();

            var result = _mapper.Map<IEnumerable<DepositDto>>(deposits);

            return Ok(result);
        }

        [HttpPost]
        public IActionResult CreateDeposit([FromBody] CreateDepositDto dto)
        {
            if (!_depositService.CreateDeposit(dto, out var error))
                return BadRequest(error);

            return StatusCode(201);
        }

        [HttpPut("{depositId}/add-money")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult AddMoneyToDeposit(int depositId, [FromBody] AddMoneyToDepositDto dto)
        {
            if (!_depositService.AddMoneyToDeposit(depositId, dto, out var error))
                return BadRequest(error);

            return NoContent();
        }

    }
}
