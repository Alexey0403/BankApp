using AutoMapper;
using BankBackendApp.Dto;
using BankBackendApp.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BankBackendApp.Controllers
{
    [Route("api/admin/users")]
    [ApiController]
    [Authorize(Policy = "Admin")]
    public class AdminUserController : Controller
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public AdminUserController(
            IUserRepository userRepository,
            IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<AdminUserDto>))]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public IActionResult GetUsers()
        {
            var users = _userRepository.GetUsers();

            var result = _mapper.Map<IEnumerable<AdminUserDto>>(users);
            return Ok(result);
        }

        [Authorize]
        [HttpPut("{userId}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public IActionResult UpdateUser(int userId, [FromBody] AdminUpdateUserDto dto)
        {
            if (dto == null)
                return BadRequest();

            var user = _userRepository.GetUser(userId);
            if (user == null)
                return NotFound();

            _mapper.Map(dto, user);

            if (!_userRepository.UpdateUser(user))
                return StatusCode(500, "Error while updating user");

            return NoContent();
        }

    }



}
