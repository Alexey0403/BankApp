using AutoMapper;
using BankBackendApp.Dto;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using Microsoft.AspNetCore.Authorization;
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

        [Authorize]
        [HttpGet("mydeposits")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<DepositDto>))]
        [ProducesResponseType(401)]
        [ProducesResponseType(404)]
        public IActionResult GetMyDeposits()
        {
            var userId = int.Parse(
                User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value
            );

            var deposits = _depositRepository.GetDepositsByUser(userId);

            if (deposits == null || !deposits.Any())
                return NotFound();

            var result = _mapper.Map<IEnumerable<DepositDto>>(deposits);
            return Ok(result);
        }

        [Authorize]
        [HttpPost]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public IActionResult CreateDeposit([FromBody] CreateDepositDto dto)
        {
            var userId = int.Parse(
                User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value
            );

            if (!_depositService.CreateDeposit(userId, dto, out var error))
                return BadRequest(error);

            return StatusCode(201);
        }

        [Authorize]
        [HttpPut("{depositId}/add-money")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public IActionResult AddMoneyToDeposit(int depositId, [FromBody] AddMoneyToDepositDto dto)
        {
            var userId = int.Parse(
                User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value
            );

            if (!_depositService.AddMoneyToDeposit(userId, depositId, dto, out var error))
                return BadRequest(error);

            return NoContent();
        }
    }
}
