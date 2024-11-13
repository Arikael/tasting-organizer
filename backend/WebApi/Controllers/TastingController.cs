using Microsoft.AspNetCore.Mvc;
using TastingOrganizer.Domain.UseCases;
using TastingOrganizer.Domain.UseCases.CreateTasting;
using TastingOrganizer.Domain.UseCases.SaveTasting;
using TastingOrganizer.WebApi.Dtos;

namespace TastingOrganizer.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class TastingController : ControllerBase
{
    private readonly ICreateTastingUseCase _createTastingUseCase;

    public TastingController(ICreateTastingUseCase createTastingUseCase)
    {
        _createTastingUseCase = createTastingUseCase;
    }
    
    [HttpPost]
    public IActionResult CreateDraft(CreateTastingDto createTastingDto)
    {
        var createTastingModel = new CreateTastingModel
        {
            Title = createTastingDto.Title
        };
        
        _createTastingUseCase.CreateTastingDraft(createTastingModel);

        return Ok();
    }

    [HttpPost]
    [Route("{code}")]
    public IActionResult Save(SaveTastingModel saveTastingModel)
    {
        return Ok();
    }
}