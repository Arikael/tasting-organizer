using Domain.Entities;

namespace Domain.Interfaces;

public interface ITastingQueries
{
    IEnumerable<Tasting> GetTastingsForUser(string user);
}