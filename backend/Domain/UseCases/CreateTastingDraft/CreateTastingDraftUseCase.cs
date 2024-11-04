using TastingOrganizer.Domain.Entities;
using TastingOrganizer.Domain.Interfaces;
using TastingOrganizer.Domain.Validation;

namespace TastingOrganizer.Domain.UseCases.CreateTastingDraft;

public class CreateTastingDraftUseCase: ICreateTastingUseCase
{
    private readonly TastingValidator _tastingValidator;
    private readonly ITastingRepository _tastingRepository;

    public CreateTastingDraftUseCase(TastingValidator tastingValidator, ITastingRepository tastingRepository)
    {
        _tastingValidator = tastingValidator;
        _tastingRepository = tastingRepository;
    }
    
    public Tasting CreateTastingDraft()
    {
        var tasting = new Tasting();
        tasting.IsPublished = false;
        _tastingValidator.Validate(tasting);
        _tastingRepository.SaveTasting(tasting);

        return tasting;
    }
}