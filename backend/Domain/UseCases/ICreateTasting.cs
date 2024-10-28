using Domain.Entities;

namespace Domain.UseCases;

public interface ICreateTasting
{
    void CreateTasting(Tasting tasting);
}