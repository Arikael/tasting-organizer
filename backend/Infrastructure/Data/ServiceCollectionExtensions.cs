using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace TastingOrganizer.Infrastructure.Data;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDbContext(this IServiceCollection services, 
        string? connectionString)
    {
        return services.AddDbContextPool<TastingOrganizerContext>(opt =>
            opt.UseNpgsql(connectionString).UseSnakeCaseNamingConvention());
    }
}