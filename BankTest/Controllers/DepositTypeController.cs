using AutoMapper;
using BankBackendApp.Dto;
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
        private readonly IMapper _mapper;

        public DepositTypeController(IDepositTypeRepository depositTypeRepository, IMapper mapper)
        {
            _depositTypeRepository = depositTypeRepository;
            _mapper = mapper;
        }

        // GET api/DepositType
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<DepositTypeDto>))]
        public IActionResult GetDepositTypes()
        {
            var depositTypes = _depositTypeRepository.GetDepositTypes();

            var result = _mapper.Map<IEnumerable<DepositTypeDto>>(depositTypes);

            return Ok(result);
        }
    }
}
