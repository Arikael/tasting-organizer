using Domain.Entities;

namespace Domain.Interfaces;

public interface ITastingRepository
{
    IEnumerable<Tasting> GetTastingsForUser(string user);
    Tasting? GetTasting(string code);
}