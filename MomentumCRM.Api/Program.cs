using Microsoft.EntityFrameworkCore;
using MomentumCRM.Persistence.Contexts;

var builder = WebApplication.CreateBuilder(args);

string connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new NullReferenceException("No connection string configured");

builder.Services.AddDbContext<MomentumCrmDbContext>(options => 
    options.UseNpgsql(connectionString, b => b.MigrationsAssembly("MomentumCRM.Persistence")));

builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddHealthChecks();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

app.Run();