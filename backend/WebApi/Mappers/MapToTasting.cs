using TastingOrganizer.Domain.Entities;
using TastingOrganizer.Domain.UseCases.SaveTasting;

namespace TastingOrganizer.WebApi.Mappers;

public class MapToTasting
{
    public Tasting MapTo(SaveTastingDto saveTastingDto)
    {
        return new Tasting();
    }
}