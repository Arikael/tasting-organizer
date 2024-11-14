using FluentValidation;
using TastingOrganizer.Domain.Entities;

namespace TastingOrganizer.Domain.Validation;

public class BaseTastingValidator: AbstractValidator<Tasting>
{
    public BaseTastingValidator()
    {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.AdminCode).NotEmpty();
        RuleFor(x => x.PublicCode).NotEmpty();
    }
}