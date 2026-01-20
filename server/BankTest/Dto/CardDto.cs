using BankBackendApp.Models;

namespace BankBackendApp.Dto
{
    public class CardDto
    {
        public int id { get; set; }
        public string number { get; set; }
        public int month { get; set; }
        public int year { get; set; }
        public bool is_active { get; set; }
    }
    public class OutCardDto
    {
        public int id { get; set; }
        public string number { get; set; }
        public int month { get; set; }
        public int year { get; set; }
        public int cvv { get; set; }
        public bool is_active { get; set; }

        public int currency_id { get; set; }
        public int card_provider_id { get; set; }

        public CurrencyDto Currency { get; set; }
        public CardProviderDto CardProvider { get; set; }
    }



}
