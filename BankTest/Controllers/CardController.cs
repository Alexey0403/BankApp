using AutoMapper;
using BankBackendApp.Dto;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using Microsoft.AspNetCore.Mvc;

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

        [HttpGet("account/{accountId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<OutCardDto>))]
        [ProducesResponseType(404)]
        public IActionResult GetCardsByAccount(int accountId)
        {
            var cards = _cardRepository.GetCardsByAccount(accountId);

            if (cards == null || !cards.Any())
                return NotFound();

            var result = _mapper.Map<IEnumerable<OutCardDto>>(cards);

            return Ok(result);
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

        [HttpPut("{cardId}/close")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult CloseCard(int cardId)
        {
            var card = _cardRepository.GetCard(cardId);

            if (card == null)
                return NotFound();

            if (!card.is_active)
                return NoContent();

            card.is_active = false;

            if (!_cardRepository.UpdateCard(card))
                return StatusCode(500, "Error while closing card");

            return NoContent();
        }

        [HttpPut("{cardId}/reopen")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult ReopenCard(int cardId)
        {
            var card = _cardRepository.GetCard(cardId);

            if (card == null)
                return NotFound();

            if (card.is_active)
                return NoContent(); 

            card.is_active = true;

            if (!_cardRepository.UpdateCard(card))
                return StatusCode(500, "Error while reopening card");

            return NoContent();
        }

    }
}
