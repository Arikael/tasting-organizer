namespace TastingOrganizer.Domain.Entities;

public class Flight
{
    public int Id { get; set; }
    public Tasting Tasting { get; set; }
    public string? Title {get; set;}
    public string? Description {get; set;}
    public int Index {get; set;}
    
    public IEnumerable<Wine> Wines {get; set;} = new List<Wine>();
}