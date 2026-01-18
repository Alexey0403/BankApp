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
            CreateMap<User, UserDto>(); 

            CreateMap<UpdateUserDto, User>()
                .ForMember(dest => dest.id, opt => opt.Ignore())
                .ForMember(dest => dest.gmail, opt => opt.Ignore())
                .ForMember(dest => dest.phone_number, opt => opt.Ignore())
                .ForMember(dest => dest.hash_password, opt => opt.Ignore())
                .ForMember(dest => dest.created_at, opt => opt.Ignore()); 
            CreateMap<User, AdminUserDto>();
            CreateMap<AdminUpdateUserDto, User>()
                .ForMember(dest => dest.id, opt => opt.Ignore())
                .ForMember(dest => dest.gmail, opt => opt.Ignore())
                .ForMember(dest => dest.phone_number, opt => opt.Ignore())
                .ForMember(dest => dest.hash_password, opt => opt.Ignore())
                .ForMember(dest => dest.publickey, opt => opt.Ignore())
                .ForMember(dest => dest.created_at, opt => opt.Ignore());

            //ACCOUNT
            CreateMap<CreateAccountDto, Account>()
            .ForMember(dest => dest.balance, opt => opt.MapFrom(_ => 0))
            .ForMember(dest => dest.is_active, opt => opt.MapFrom(_ => true))
            .ForMember(dest => dest.created_at, opt => opt.MapFrom(_ => DateTime.UtcNow))
            .ForMember(dest => dest.number, opt => opt.Ignore());
            
            CreateMap<Account, AccountDto>();

            CreateMap<Account, AdminAccountDto>();

            //CARD
            CreateMap<Card, CardDto>();

            CreateMap<CreateCardDto, Card>()
                .ForMember(dest => dest.number, opt => opt.Ignore())
                .ForMember(dest => dest.cvv, opt => opt.Ignore())
                .ForMember(dest => dest.currency_id, opt => opt.Ignore())
                .ForMember(dest => dest.created_at, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.is_active, opt => opt.MapFrom(_ => true));
            CreateMap<Card, OutCardDto>();

            CreateMap<Card, AdminCardDto>();
            //DEPOSIT
            CreateMap<Deposit, DepositDto>();

            //DEPOSITTYPE
            CreateMap<DepositType, DepositTypeDto>();

            //TRANSACTION
            CreateMap<Transaction, TransactionDto>();

            //CURRENCY
            CreateMap<Currency, CurrencyDto>();
            
            //CARDPROVIDER
            CreateMap<CardProvider, CardProviderDto>();

            //TRANSACTIONSTATUS
            CreateMap<TransactionStatus, TransactionStatusDto>();
        }
    }
}
