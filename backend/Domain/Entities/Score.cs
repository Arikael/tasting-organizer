namespace TastingOrganizer.Domain.Entities;

public class Score
{
    public int Id { get; set; }
    public TastingParticipant TastingParticipant { get; set; }
    public Wine Wine { get; set; }
    public decimal Points { get; set; }
}