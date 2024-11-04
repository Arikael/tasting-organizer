using TastingOrganizer.Domain.Entities;

namespace TastingOrganizer.Domain.UseCases.CreateTastingDraft;

public interface ICreateTastingUseCase
{
    Tasting CreateTastingDraft();
}