using FluentValidation;
using TastingOrganizer.Domain.Entities;

namespace TastingOrganizer.Domain.Validation;

public class TastingValidator: AbstractValidator<Tasting>
{
    public TastingValidator()
    {
        RuleFor(x => x.Title).NotEmpty();
    }
}