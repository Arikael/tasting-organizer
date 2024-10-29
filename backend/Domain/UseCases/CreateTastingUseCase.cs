using TastingOrganizer.Domain.Entities;
using TastingOrganizer.Domain.Validation;

namespace TastingOrganizer.Domain.UseCases;

public class CreateTastingUseCase: ICreateTasting
{
    private readonly TastingValidator _tastingValidator;

    public CreateTastingUseCase(TastingValidator tastingValidator)
    {
        _tastingValidator = tastingValidator;
    }
    
    public void CreateTasting(Tasting tasting)
    {
        _tastingValidator.Validate(tasting);
    }
}