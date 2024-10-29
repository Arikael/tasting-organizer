namespace TastingOrganizer.Domain.Entities;

public class TastingParticipant
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string? Email { get; set; }
    public bool NeedsToPay { get; set; } = true;
    public DateTime? PayDate { get; set; }
    public bool Invited { get; set; }
    
    public User? User { get; set; }
    public IEnumerable<Score>? Scores { get; set; } = new List<Score>();
}