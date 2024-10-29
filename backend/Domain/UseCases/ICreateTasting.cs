using TastingOrganizer.Domain.Entities;

namespace TastingOrganizer.Domain.UseCases;

public interface ICreateTasting
{
    void CreateTasting(Tasting tasting);
}