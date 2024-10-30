using Microsoft.AspNetCore.Mvc;
using TastingOrganizer.Domain.UseCases;

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
    public IActionResult? Post()
    {   
        _createTastingUseCase.CreateTastingDraft();

        return Ok();
    }
}