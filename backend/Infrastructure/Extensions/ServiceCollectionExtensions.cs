using Microsoft.Extensions.DependencyInjection;
using TastingOrganizer.Domain.Interfaces;
using TastingOrganizer.Infrastructure.Data.Repositories;

namespace TastingOrganizer.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAllRepositories(this IServiceCollection services)
    {
        return services.AddScoped<ITastingRepository, TastingRepository>();
    }
}