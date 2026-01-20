using AutoMapper;
using BankBackendApp.Dto;
using BankBackendApp.Interfaces;
using BankBackendApp.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BankBackendApp.Controllers
{
    [Route("api/admin/cards")]
    [ApiController]
    [Authorize(Policy = "Admin")]
    public class AdminCardController : Controller
    {
        private readonly ICardRepository _cardRepository;
        private readonly ICardService _cardService;
        private readonly IMapper _mapper;

        public AdminCardController(ICardRepository cardRepository, ICardService cardService, IMapper mapper)
        {
            _cardRepository = cardRepository;
            _cardService = cardService;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<AdminCardDto>))]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public IActionResult GetAccounts([FromQuery] bool? status, string? number)
        {
            var cards = _cardRepository.GetCards(status, number);

            var result = _mapper.Map<IEnumerable<AdminCardDto>>(cards);
            return Ok(result);
        }

        [Authorize]
        [HttpDelete("{cardId}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public IActionResult DeleteAccount(int cardId)
        {
            var card = _cardRepository.GetCard(cardId);
            if (card == null)
                return NotFound();

            if (card.is_active)
                return BadRequest("Card must be inactive before deletion");

            if (!_cardRepository.DeleteCard(card))
                return StatusCode(500, "Error while deleting card");

            return NoContent();
        }
    }
}
