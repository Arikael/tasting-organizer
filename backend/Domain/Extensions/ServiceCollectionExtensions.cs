using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using TastingOrganizer.Domain.UseCases;
using TastingOrganizer.Domain.UseCases.CreateTasting;
using TastingOrganizer.Domain.Validation;

namespace TastingOrganizer.Domain.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAllUseCases(this IServiceCollection services)
    {
        return services.AddScoped<ICreateTastingUseCase, CreateTastingUseCase>();
    }

    public static IServiceCollection AddAllValidators(this IServiceCollection services)
    {
        return services.AddValidatorsFromAssemblyContaining<BaseTastingValidator>();
    }
}