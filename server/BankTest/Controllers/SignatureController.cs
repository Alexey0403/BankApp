using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace BankBackendApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SignatureController : Controller
    {
        private readonly ISignatureRepository _signatureRepository;

        public SignatureController(ISignatureRepository signatureRepository)
        {
            _signatureRepository = signatureRepository;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Signature>))]
        public IActionResult GetSignatures()
        {
            var signatures = _signatureRepository.GetSignatures();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(signatures);
        }
    }
}
