using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using MomentumCRM.Services.Common.Exceptions;

namespace Api;

public class GlobalExceptionHandler : IExceptionHandler {
    public async ValueTask<bool> TryHandleAsync(
        HttpContext context,
        Exception exception,
        CancellationToken ct) {
        var (status, title) = exception switch {
            CustomerAlreadyExistsException => (StatusCodes.Status409Conflict, exception.Message),
            _ => (StatusCodes.Status404NotFound, exception.Message)
        };

        context.Response.StatusCode = status;
        await context.Response.WriteAsJsonAsync(new ProblemDetails {
            Status = status,
            Title = title
        }, ct);

        return true;
    }
}