using BankBackendApp.Models;

public class CardProvider
{
    public int id { get; set; }
    public string name { get; set; }   
    public string code { get; set; }   

    public ICollection<Card> Cards { get; set; }
}
