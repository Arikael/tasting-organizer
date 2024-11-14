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
        // TODO check what we want to return
        if (context.Exception is FluentValidation.ValidationException validationException)
        {
            context.Result = new BadRequestObjectResult(validationException.Errors);
            context.ExceptionHandled = true;
        }
    }

    public int Order => 10;
}