using TastingOrganizer.Domain.Entities;

namespace TastingOrganizer.Domain.Interfaces;

public interface ITastingRepository
{
    IEnumerable<Tasting> GetTastingsForUser(string user);
    Tasting? GetTastingByAdminCode(string adminCode);
    
    Task SaveTasting(Tasting tasting, CancellationToken cancellationToken = default);
}