using Domain.Entities;
using Domain.Validation;

namespace Domain.UseCases;

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