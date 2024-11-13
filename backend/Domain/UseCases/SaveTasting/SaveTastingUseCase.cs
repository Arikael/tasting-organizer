using FluentValidation;
using TastingOrganizer.Domain.Interfaces;

namespace TastingOrganizer.Domain.UseCases.SaveTasting;

public class SaveTastingUseCase: ISaveTastingUseCase
{
    private AbstractValidator<SaveTastingModel> _saveTastingValidator;
    private readonly ITastingRepository _tastingRepository;

    public SaveTastingUseCase(AbstractValidator<SaveTastingModel> saveTastingValidator, ITastingRepository tastingRepository)
    {
        _saveTastingValidator = saveTastingValidator;
        _tastingRepository = tastingRepository;
    }
    
    public void SaveTasting(SaveTastingModel tastingModel)
    {
        _saveTastingValidator.ValidateAndThrow(tastingModel);
        var tasting = _tastingRepository.GetTastingByAdminCode(tastingModel.AdminCode);

        if (tasting is null)
        {
            
        }
    }
}