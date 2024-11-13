using FluentValidation;
using TastingOrganizer.Domain.Validation;

namespace TastingOrganizer.Domain.UseCases.CreateTasting;

public class CreateTastingValidator: BaseTastingValidator
{
    public CreateTastingValidator()
    {
        RuleFor(x => x.Title).NotEmpty();
    }
}