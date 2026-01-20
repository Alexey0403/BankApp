using AutoMapper;
using BankBackendApp.Dto;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using BankBackendApp.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BankBackendApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CardController : Controller
    {
        private readonly ICardRepository _cardRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly IMapper _mapper;
        private readonly ICardService _cardService;

        public CardController(ICardRepository cardRepository,IAccountRepository accountRepository,  IMapper mapper, ICardService cardService)
        {
            _cardRepository = cardRepository;
            _accountRepository = accountRepository;
            _mapper = mapper;
            _cardService = cardService;
        }

        [Authorize]
        [HttpGet("account/{accountId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<OutCardDto>))]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public IActionResult GetCardsByAccount(int accountId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var account = _accountRepository.GetAccount(accountId);
            if (account == null)
                return NotFound();

            if (account.user_id != userId)
                return Forbid();

            var cards = _cardRepository.GetCardsByAccount(accountId);
            if (cards == null || !cards.Any())
                return NotFound();

            var result = _mapper.Map<IEnumerable<OutCardDto>>(cards);
            return Ok(result);
        }


        [Authorize]
        [HttpPost]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public IActionResult CreateCard([FromBody] CreateCardDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            if (dto == null)
                return BadRequest();

            var account = _accountRepository.GetAccount(dto.account_id);
            if (account == null)
                return NotFound();

            if (account.user_id != userId)
                return Forbid();

            var result = _cardService.CreateCardForAccount(dto.account_id, dto.card_provider_id);

            if (result == null)
                return BadRequest("Cannot create card");

            var output = _mapper.Map<OutCardDto>(_cardRepository.GetCard(result.id));

            return StatusCode(201, output);
        }

        [Authorize]
        [HttpPut("{cardId}/close")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public IActionResult CloseCard(int cardId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var card = _cardRepository.GetCard(cardId);

            if (card == null)
                return NotFound();

            var account = _accountRepository.GetAccount(card.account_id);
            if (account == null)
                return NotFound();

            if (account.user_id != userId)
                return Forbid();

            if (!card.is_active)
                return NoContent();

            card.is_active = false;

            if (!_cardRepository.UpdateCard(card))
                return StatusCode(500, "Error while closing card");

            return NoContent();
        }

        [Authorize]
        [HttpPut("{cardId}/reopen")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public IActionResult ReopenCard(int cardId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var card = _cardRepository.GetCard(cardId);

            if (card == null)
                return NotFound();

            var account = _accountRepository.GetAccount(card.account_id);
            if (account == null)
                return NotFound();

            if (account.user_id != userId)
                return Forbid();

            if (card.is_active)
                return NoContent(); 

            card.is_active = true;

            if (!_cardRepository.UpdateCard(card))
                return StatusCode(500, "Error while reopening card");

            return NoContent();
        }

    }
}
