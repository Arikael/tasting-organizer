namespace Domain.Entities;

public class Score
{
    public TastingParticipant TastingParticipant { get; set; }
    public Wine Wine { get; set; }
    public decimal Points { get; set; }
}