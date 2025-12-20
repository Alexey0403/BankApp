using AutoMapper;
using BankBackendApp.Dto;
using BankBackendApp.Models;
namespace BankBackendApp.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            //USER
            CreateMap<UpdateUserDto, User>();
            //ACCOUNT
            CreateMap<CreateAccountDto, Account>()
            .ForMember(dest => dest.balance, opt => opt.MapFrom(_ => 0))
            .ForMember(dest => dest.is_active, opt => opt.MapFrom(_ => true))
            .ForMember(dest => dest.created_at, opt => opt.MapFrom(_ => DateTime.UtcNow))
            .ForMember(dest => dest.number, opt => opt.Ignore());
            
            CreateMap<Account, AccountDto>();

            //CARD
            CreateMap<Card, CardDto>();

            CreateMap<CreateCardDto, Card>()
                .ForMember(dest => dest.number, opt => opt.Ignore())
                .ForMember(dest => dest.cvv, opt => opt.Ignore())
                .ForMember(dest => dest.currency_id, opt => opt.Ignore())
                .ForMember(dest => dest.created_at, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.is_active, opt => opt.MapFrom(_ => true));
            CreateMap<Card, OutCardDto>();
            //DEPOSIT
            CreateMap<Deposit, DepositDto>();

            //DEPOSITTYPE
            CreateMap<DepositType, DepositTypeDto>();

            //TRANSACTION
            CreateMap<Transaction, TransactionDto>();
        }
    }
}
