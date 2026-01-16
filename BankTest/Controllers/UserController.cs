using AutoMapper;
using BankBackendApp.Dto;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BankBackendApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet("myprofile")]
        [ProducesResponseType(200, Type = typeof(UserDto))]
        [ProducesResponseType(401)]
        public IActionResult GetMe()
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var user = _userRepository.GetUser(userId);
            if (user == null)
                return NotFound();

            var result = _mapper.Map<UserDto>(user);
            return Ok(result);
        }

        [Authorize]
        [HttpPut("myprofile/update")]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public IActionResult UpdateUser([FromBody] UpdateUserDto dto)
        {
            if (dto == null)
                return BadRequest();

            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var user = _userRepository.GetUser(userId);
            if (user == null)
                return NotFound();

            if (user.publickey != null)
                return StatusCode(500, "Public key is already exists");

            _mapper.Map(dto, user);

            if (!_userRepository.UpdateUser(user))
                return StatusCode(500, "Error while updating user");

            var result = _mapper.Map<UserDto>(_userRepository.GetUser(user.id));

            return StatusCode(201, result);
        }

    }
}
