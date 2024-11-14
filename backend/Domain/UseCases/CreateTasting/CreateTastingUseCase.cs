using FluentValidation;
using TastingOrganizer.Domain.Entities;
using TastingOrganizer.Domain.Interfaces;
using TastingOrganizer.Domain.Validation;

namespace TastingOrganizer.Domain.UseCases.CreateTasting;

public class CreateTastingUseCase: ICreateTastingUseCase
{
    private readonly BaseTastingValidator _validator;
    private readonly ITastingRepository _tastingRepository;

    public CreateTastingUseCase(CreateTastingValidator validator, ITastingRepository tastingRepository)
    {
        _validator = validator;
        _tastingRepository = tastingRepository;
    }
    
    public Tasting CreateTastingDraft(CreateTastingModel createTastingModel)
    {
        var tasting = new Tasting()
        {
            Title = createTastingModel.Title
        };
        tasting.IsPublished = false;
        _validator.ValidateAndThrow(tasting);
        _tastingRepository.SaveTasting(tasting);

        return tasting;
    }
}