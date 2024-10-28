using Domain.Entities;
using Domain.Interfaces;

namespace Database.Data.Repositories;

public class TastingRepository: ITastingRepository
{
    private readonly TastingOrganizerContext _context;

    public TastingRepository(TastingOrganizerContext context)
    {
        _context = context;
    }
    
    public IEnumerable<Tasting> GetTastingsForUser(string user)
    {
        return _context.Tastings.Where(x => x.Creator == user);
    }

    public Tasting? GetTasting(string code)
    {
        return _context.Tastings.FirstOrDefault(x => x.Code == code);
    }
}