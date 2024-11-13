using TastingOrganizer.Domain.Entities;

namespace TastingOrganizer.Domain.UseCases.CreateTasting;

public interface ICreateTastingUseCase
{
    Tasting CreateTastingDraft(CreateTastingModel createTastingModel);
}