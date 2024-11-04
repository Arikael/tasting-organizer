using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace TastingOrganizer.WebApi.Filters;

public class ValidationExceptionFilter : IActionFilter, IOrderedFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        if (context.Exception is not null)
        {
            context.Result = new BadRequestObjectResult(context.Exception);
            context.ExceptionHandled = true;
        }
    }

    public int Order => 10;
}