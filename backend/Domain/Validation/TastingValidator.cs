using Domain.Entities;
using FluentValidation;

namespace Domain.Validation;

public class TastingValidator: AbstractValidator<Tasting>
{
    public TastingValidator()
    {
        RuleFor(x => x.Title).NotEmpty();
    }
}