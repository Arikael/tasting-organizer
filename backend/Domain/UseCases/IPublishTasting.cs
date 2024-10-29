using Domain.Entities;

namespace Domain.UseCases;

public interface IPublishTasting
{
    void PublishTasting(Tasting tasting);
}