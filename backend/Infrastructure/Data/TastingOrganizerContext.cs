using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Database.Data;

public class TastingOrganizerContext: DbContext
{
    public DbSet<Tasting> Tastings { get; set; }
}