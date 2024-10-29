using Microsoft.AspNetCore.Mvc;

namespace TastingOrganizer.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class TastingDraftController : ControllerBase
{
    [HttpPost]
    public IActionResult? Post()
    {
        return null;
    }
}