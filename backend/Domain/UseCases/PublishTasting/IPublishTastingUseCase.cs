using TastingOrganizer.Domain.Entities;

namespace TastingOrganizer.Domain.UseCases.PublishTasting;

public interface IPublishTastingUseCase
{
    void PublishTasting(Tasting tasting);
}