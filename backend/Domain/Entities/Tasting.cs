using TastingOrganizer.Lib.Utils;

namespace TastingOrganizer.Domain.Entities;

public class Tasting
{
    public int Id { get; set; }
    public DateTime From { get; set; }
    public DateTime? To { get; set; }
    public string Description { get; set; } = "";
    public int MaxPeopleCount { get; set; }
    public string Title { get; set; } = "";
    public decimal PricePerPerson { get; set; }
    public string Place  { get; set; } = "";
    public string Creator { get; set; } = "";
    public string Organizers { get; set; } = "";
    public ScoringType ScoringType { get; set; }
    public RevealType RevealType { get; set; }
    public string Code { get; set; }
    public string? AccessCode { get; set; }
    public bool IsPublished { get; set; } = false;
    
    public IEnumerable<Flight> Flights { get; set; } = new List<Flight>();

    public Tasting()
    {
        Code = StringUtils.RandomString(6);
    }
}