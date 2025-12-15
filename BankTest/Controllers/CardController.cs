using AutoMapper;
using BankBackendApp.Dto;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using Microsoft.AspNetCore.Mvc;
using static BankBackendApp.Services.CardGeneratorService;

namespace BankBackendApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CardController : Controller
    {
        private readonly ICardRepository _cardRepository;
        private readonly IMapper _mapper;
        private readonly ICardService _cardService;

        public CardController(ICardRepository cardRepository, IMapper mapper, ICardService cardService)
        {
            _cardRepository = cardRepository;
            _mapper = mapper;
            _cardService = cardService;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Card>))]
        public IActionResult GetCards()
        {
            var cards = _cardRepository.GetCards();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(cards);
        }

        [HttpPost]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        public IActionResult CreateCard([FromBody] CreateCardDto dto)
        {
            if (dto == null)
                return BadRequest();

            var result = _cardService.CreateCardForAccount(dto.account_id, dto.card_provider_id);

            if (!result)
                return BadRequest("Cannot create card");

            return StatusCode(201);
        }
    }
}
