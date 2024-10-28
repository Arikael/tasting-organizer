namespace Domain.Entities;

public class Wine
{
    public string Name { get; set; }
    public string Producer { get; set; }
    public decimal Price { get; set; }
    public decimal RetailPrice { get; set; }
    public Flight Flight { get; set; }  
    public IEnumerable<Score> Scores { get; set; } = new List<Score>();
}