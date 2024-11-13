using TastingOrganizer.Domain.Entities;

namespace TastingOrganizer.Domain.UseCases.SaveTasting;

public interface ISaveTastingUseCase
{
    void SaveTasting(SaveTastingModel tasting);
}