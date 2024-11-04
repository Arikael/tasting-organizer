using FluentValidation;
using TastingOrganizer.Domain.Interfaces;

namespace TastingOrganizer.Domain.UseCases.SaveTasting;

public class SaveTastingUseCase: ISaveTastingUseCase
{
    private AbstractValidator<SaveTastingDto> _saveTastingValidator;
    private readonly ITastingRepository _tastingRepository;

    public SaveTastingUseCase(AbstractValidator<SaveTastingDto> saveTastingValidator, ITastingRepository tastingRepository)
    {
        _saveTastingValidator = saveTastingValidator;
        _tastingRepository = tastingRepository;
    }
    
    public void SaveTasting(SaveTastingDto tastingDto)
    {
        _saveTastingValidator.ValidateAndThrow(tastingDto);
        var tasting = _tastingRepository.GetTasting(tastingDto.Code);

        if (tasting is null)
        {
            
        }
    }
}