using FluentValidation;

namespace TastingOrganizer.Domain.UseCases.SaveTasting;

public class SaveTastingValidator: AbstractValidator<SaveTastingDto>
{
    public SaveTastingValidator()
    {
        RuleFor(x => x.Title).NotEmpty().WithErrorCode("Validation:Tasting:TitleRequired");
        RuleFor(x => x.Id).NotEmpty().GreaterThan(0).WithErrorCode("Validation:Tasting:IdRequired");
        RuleFor(x => x.Code).NotEmpty().WithErrorCode("Validation:Tasting:CodeRequired");
    }
}