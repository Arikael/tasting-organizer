using Microsoft.EntityFrameworkCore;
using TastingOrganizer.Domain.Entities;

namespace TastingOrganizer.Infrastructure.Data;

public class TastingOrganizerContext: DbContext
{
    public TastingOrganizerContext(DbContextOptions options) : base(options)
    {
        
    }
    
  
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        
    }

    public DbSet<Tasting> Tastings { get; set; }
}