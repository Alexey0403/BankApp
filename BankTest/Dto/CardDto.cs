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
}
