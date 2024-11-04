using Microsoft.AspNetCore.Mvc;
using TastingOrganizer.Domain.UseCases;
using TastingOrganizer.Domain.UseCases.CreateTastingDraft;
using TastingOrganizer.Domain.UseCases.SaveTasting;

namespace TastingOrganizer.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class TastingDraftController : ControllerBase
{
    private readonly ICreateTastingUseCase _createTastingUseCase;

    public TastingDraftController(ICreateTastingUseCase createTastingUseCase)
    {
        _createTastingUseCase = createTastingUseCase;
    }
    
    [HttpPost]
    [Route("Draft")]
    public IActionResult CreateDraft()
    {   
        _createTastingUseCase.CreateTastingDraft();

        return Ok();
    }

    [HttpPost]
    [Route("{code}")]
    public IActionResult Save(SaveTastingDto saveTastingDto)
    {
        
        return Ok();
    }
}