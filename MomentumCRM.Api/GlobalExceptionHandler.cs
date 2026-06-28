using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using MomentumCRM.Persistence.Exceptions;
using MomentumCRM.Services.Common.Exceptions;

namespace Api;

public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler {
    public async ValueTask<bool> TryHandleAsync(
        HttpContext context,
        Exception exception,
        CancellationToken ct) {
        (int status, string? title) = exception switch {
            // Customers
            CustomerAlreadyExistsException => (StatusCodes.Status409Conflict, exception.Message),
            CustomerNotFoundException => (StatusCodes.Status404NotFound, "Customer not found"),
            CustomerHasNoContactInfoException => (StatusCodes.Status400BadRequest, exception.Message),

            // Phone
            InvalidPhoneNumberException => (StatusCodes.Status400BadRequest, exception.Message),

            _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred")
        };

        if (status >= StatusCodes.Status500InternalServerError)
            logger.LogError(
                exception, "Unhandled exception on {Method} {Path}", context.Request.Method, context.Request.Path);

        context.Response.StatusCode = status;
        await context.Response.WriteAsJsonAsync(new ProblemDetails {
            Status = status,
            Title = title
        }, ct);

        return true;
    }
}