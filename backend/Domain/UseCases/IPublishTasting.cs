using TastingOrganizer.Domain.Entities;

namespace TastingOrganizer.Domain.UseCases;

public interface IPublishTasting
{
    void PublishTasting(Tasting tasting);
}