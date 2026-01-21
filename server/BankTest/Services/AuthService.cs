using BankBackendApp.Data;
using BankBackendApp.Dto;
using BankBackendApp.Dto.Auth;
using BankBackendApp.Interfaces;
using BankBackendApp.Models;
using System;
using System.Linq;

namespace BankBackendApp.Services
{
    public class AuthService : IAuthService
    {
        private readonly DataContext _context;
        private readonly IPasswordHashService _passwordHashService;
        private readonly IJwtService _jwtService;

        public AuthService(DataContext context, IPasswordHashService passwordHashService, IJwtService jwtService)
        {
            _context = context;
            _passwordHashService = passwordHashService;
            _jwtService = jwtService;
        }

        public AuthResponseDto Register(RegisterDto dto, out string error)
        {
            error = string.Empty;

            if (dto == null)
            {
                error = "Invalid data";
                return null;
            }

            if (string.IsNullOrWhiteSpace(dto.gmail) || string.IsNullOrWhiteSpace(dto.password))
            {
                error = "Gmail and password are required";
                return null;
            }

            bool exists = _context.user.Any(u => u.gmail == dto.gmail);
            if (exists)
            {
                error = "User already exists";
                return null;
            }

            var user = new User
            {
                name = dto.name,
                surname = dto.surname,
                birthday = dto.birthday,          
                phone_number = dto.phone_number,
                gmail = dto.gmail,
                hash_password = _passwordHashService.HashPassword(dto.password),
                created_at = DateTime.UtcNow,
                role_id = 2 
            };

            _context.user.Add(user);
            _context.SaveChanges();

            var token = _jwtService.GenerateToken(user);

            return new AuthResponseDto
            {
                token = token,
                user_id = user.id,
                role_id = user.role_id
            };
        }

        public AuthResponseDto Login(LoginDto dto, out string error)
        {
            error = string.Empty;

            if (dto == null || string.IsNullOrWhiteSpace(dto.login) || string.IsNullOrWhiteSpace(dto.password))
            {
                error = "Login and password are required";
                return null;
            }

            User user;

            if (dto.login.Contains("@"))
            {
                user = _context.user.FirstOrDefault(u => u.gmail == dto.login);
            }
            else
            {
                user = _context.user.FirstOrDefault(u => u.phone_number == dto.login);
            }

            if (user == null)
            {
                error = "User not found";
                return null;
            }

            bool ok = _passwordHashService.VerifyPassword(dto.password, user.hash_password);
            if (!ok)
            {
                error = "Invalid password";
                return null;
            }

            var token = _jwtService.GenerateToken(user);

            return new AuthResponseDto
            {
                token = token,
                user_id = user.id,
                role_id = user.role_id
            };
        }
    }
}
