using Microsoft.Extensions.DependencyInjection;

namespace Database.Data;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDbContext(this IServiceCollection services)
    {
        return services;
    }
}