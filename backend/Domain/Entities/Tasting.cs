using TastingOrganizer.Lib.Utils;

namespace TastingOrganizer.Domain.Entities;

public class Tasting
{
    private const int CodeMaxLength = 6;
    public int Id { get; set; }
    public DateTime From { get; set; }
    public DateTime? To { get; set; }
    public string Description { get; set; } = "";
    public int MaxPeopleCount { get; set; }
    public required string Title { get; set; } = "";
    public decimal PricePerPerson { get; set; }
    public string Place  { get; set; } = "";
    public string Creator { get; set; } = "";
    public string Organizers { get; set; } = "";
    public ScoringType ScoringType { get; set; } = ScoringType.Hundred;
    public RevealType RevealType { get; set; } = RevealType.AtEnd;
    public string PublicCode { get; set; }
    public string AdminCode { get; set; }
    public string? AccessCode { get; set; }
    public bool IsPublished { get; set; }
    
    public IEnumerable<Flight> Flights { get; set; } = new List<Flight>();

    public Tasting()
    {
        PublicCode = StringUtils.RandomString(CodeMaxLength);
        AdminCode = StringUtils.RandomString(CodeMaxLength);
    }
}