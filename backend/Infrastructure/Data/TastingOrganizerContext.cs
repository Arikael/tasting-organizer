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
        modelBuilder.Entity<Tasting>(tasting =>
        {
            tasting.Property(x => x.Title).IsRequired().HasMaxLength(100);
            tasting.Property(x => x.AdminCode).IsRequired().HasMaxLength(10);
            tasting.Property(x => x.PublicCode).IsRequired().HasMaxLength(10);
        });
    }

    public DbSet<Tasting> Tastings { get; set; }
}