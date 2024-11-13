using TastingOrganizer.Domain.Entities;
using TastingOrganizer.Domain.Interfaces;

namespace TastingOrganizer.Infrastructure.Data.Repositories;

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

    public Tasting? GetTastingByAdminCode(string adminCode)
    {
        return _context.Tastings.FirstOrDefault(x => x.PublicCode == adminCode);
    }

    public async Task SaveTasting(Tasting tasting, CancellationToken cancellationToken = default)
    {
        if (tasting.Id == 0)
        {
            await _context.AddAsync(tasting, cancellationToken);
        }
        else
        {
            _context.Update(tasting);
        }

        await _context.SaveChangesAsync(cancellationToken);  
    }
}