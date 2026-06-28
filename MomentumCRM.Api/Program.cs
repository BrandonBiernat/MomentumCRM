using System.Text;
using System.Text.Json.Serialization;
using Api;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MomentumCRM.Persistence.Abstractions;
using MomentumCRM.Persistence.Contexts;
using MomentumCRM.Persistence.Entities;
using MomentumCRM.Services.Auth;
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

    builder.Services.AddDbContext<AuthDbContext>(options =>
        options.UseNpgsql(
            connectionString: connectionString,
            npgsqlOptionsAction: b => {
                b.MigrationsAssembly("MomentumCRM.Persistence");
                b.MigrationsHistoryTable("__EFMigrationsHistory_Auth");
            }));

    builder.Services
        .AddIdentityCore<User>(options => {
            options.User.RequireUniqueEmail = true;
            options.Password.RequiredLength = 8;
        })
        .AddRoles<IdentityRole<Guid>>()
        .AddEntityFrameworkStores<AuthDbContext>();

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

    JwtOptions jwt = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>()
        ?? throw new InvalidOperationException("Jwt configuration section is missing");

    builder.Services.Configure<JwtOptions>(
        builder.Configuration.GetSection(JwtOptions.SectionName));

    builder.Services
        .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options => {
            options.TokenValidationParameters = new TokenValidationParameters {
                ValidateIssuer = true,
                ValidIssuer = jwt.Issuer,
                ValidateAudience = true,
                ValidAudience = jwt.Audience,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key)),
                ClockSkew = TimeSpan.Zero
            };
        });

    builder.Services.AddAuthorization();

    builder.Services.AddCors(options =>
        options.AddPolicy("ReactClient", policy => policy
            .WithOrigins("http://localhost:5173", "http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()));

    builder.Services.AddHttpContextAccessor();
    builder.Services.AddScoped<ICurrentUser, CurrentUser>();

    builder.Services.AddScoped<ITokenService, JwtTokenService>();
    builder.Services.AddScoped<IAuthService, AuthService>();
    builder.Services.AddScoped<ICustomersService, CustomersService>();

    var app = builder.Build();

    app.UseSerilogRequestLogging();

    app.UseExceptionHandler();

    if (app.Environment.IsDevelopment()) {
        app.MapOpenApi();
    }

    app.UseHttpsRedirection();

    app.UseCors("ReactClient");

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();
    app.MapHealthChecks("/health");

    app.Run();
} catch (Exception ex) {
    Log.Fatal(ex, "Application terminated unexpectedly");
} finally {
    Log.CloseAndFlush();
}