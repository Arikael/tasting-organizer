using TastingOrganizer.Domain.Entities;

namespace TastingOrganizer.Domain.Interfaces;

public interface ITastingQueries
{
    IEnumerable<Tasting> GetTastingsForUser(string user);
}