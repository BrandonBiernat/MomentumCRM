using System.Text.Json.Serialization;
using Api;
using Microsoft.EntityFrameworkCore;
using MomentumCRM.Persistence.Contexts;
using MomentumCRM.Services.Customers;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try {
    var builder = WebApplication.CreateBuilder(args);

    string connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
        ?? throw new NullReferenceException("No connection string configured");

    builder.Services.AddDbContext<MomentumCrmDbContext>(options =>
        options.UseNpgsql(
            connectionString: connectionString,
            npgsqlOptionsAction: b => b.MigrationsAssembly("MomentumCRM.Persistence")));

    builder.Services.AddSerilog((services, lc) => lc
        .ReadFrom.Configuration(builder.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext());

    builder.Services.ConfigureHttpJsonOptions(o => 
        o.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

    builder.Services.AddOpenApi();
    builder.Services.AddControllers();
    builder.Services.AddHealthChecks();

    builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
    builder.Services.AddProblemDetails();

    builder.Services.AddScoped<ICustomersService, CustomersService>();

    var app = builder.Build();

    app.UseSerilogRequestLogging();

    app.UseExceptionHandler();

    if (app.Environment.IsDevelopment()) {
        app.MapOpenApi();
    }

    app.UseHttpsRedirection();

    app.UseAuthorization();

    app.MapControllers();
    app.MapHealthChecks("/health");

    app.Run();
} catch (Exception ex) {
    Log.Fatal(ex, "Application terminated unexpectedly");
} finally {
    Log.CloseAndFlush();
}